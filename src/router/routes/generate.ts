import * as fs from 'fs';
import { createCanvas, loadImage } from 'canvas';
import { router } from '../router';

const ROUTE_API = '/generate';

export const initGenerateRoutes = () => {
	router.post(ROUTE_API, (req, res) => {
		const { amount } = req.body || {};

		if (!amount) {
			res.status(400).send({
				errors: ['Amount is required'],
			});

			return;
		}

		generateCombinations(amount);
	});
};

function generateCombinations(amount: number) {
	const imageFormat = {
		width: 24,
		height: 24,
	};

	const dir = {
		traitTypes: `./layers/trait_types`,
		outputs: `./outputs`,
		background: `./layers/background`,
	};

	let totalOutputs = 0;

	const canvas = createCanvas(imageFormat.width, imageFormat.height);
	const ctx = canvas.getContext('2d');

	const priorities = ['punks', 'top', 'beard'];

	const main = async (numberOfOutputs: number) => {
		const traitTypesDir = dir.traitTypes;
		// register all the traits
		const types = fs.readdirSync(traitTypesDir);

		// set all priotized layers to be drawn first. for eg: punk type, top... You can set these values in the priorities array in line 21
		const traitTypes = priorities
			.concat(types.filter((x) => !priorities.includes(x)))
			.map((traitType) =>
				fs
					.readdirSync(`${traitTypesDir}/${traitType}/`)
					.map((value) => ({ trait_type: traitType, value: value }))
					.concat({ trait_type: traitType, value: 'N/A' })
			);

		const backgrounds = fs.readdirSync(dir.background);

		// trait type avail for each punk
		const combinations = allPossibleCases(traitTypes, numberOfOutputs);

		for (var n = 0; n < combinations.length; n++) {
			const randomBackground =
				backgrounds[Math.floor(Math.random() * backgrounds.length)];
			await drawImage(combinations[n], randomBackground, n);
		}
	};

	const recreateOutputsDir = () => {
		if (fs.existsSync(dir.outputs)) {
			fs.rmdirSync(dir.outputs, { recursive: true });
		}

		fs.mkdirSync(dir.outputs);
		fs.mkdirSync(`${dir.outputs}/metadata`);
		fs.mkdirSync(`${dir.outputs}/punks`);
	};

	const allPossibleCases = (arraysToCombine: any[], max: number) => {
		const divisors: any[] = [];
		let permsCount = 1;

		for (let i = arraysToCombine.length - 1; i >= 0; i--) {
			divisors[i] = divisors[i + 1]
				? divisors[i + 1] * arraysToCombine[i + 1].length
				: 1;
			permsCount *= arraysToCombine[i].length || 1;
		}

		console.log('divisors', divisors);

		if (!!max && max > 0) {
			console.log(max);
			permsCount = max;
		}

		totalOutputs = permsCount;

		const getCombination = (n: number, arrays: any[], divisors: any[]) =>
			arrays.reduce((acc, arr, i) => {
				acc.push(arr[Math.floor(n / divisors[i]) % arr.length]);
				return acc;
			}, []);

		const combinations = [];
		for (let i = 0; i < permsCount; i++) {
			combinations.push(getCombination(i, arraysToCombine, divisors));
		}

		return combinations;
	};

	const drawImage = async (traitTypes: any, background: any, index: number) => {
		// draw background
		const backgroundIm = await loadImage(`${dir.background}/${background}`);

		ctx.drawImage(backgroundIm, 0, 0, imageFormat.width, imageFormat.height);

		//'N/A': means that this punk doesn't have this trait type
		const drawableTraits = traitTypes.filter((x: any) => x.value !== 'N/A');
		for (let index = 0; index < drawableTraits.length; index++) {
			const val = drawableTraits[index];
			const image = await loadImage(
				`${dir.traitTypes}/${val.trait_type}/${val.value}`
			);
			ctx.drawImage(image, 0, 0, imageFormat.width, imageFormat.height);
		}

		console.log(`Progress: ${index + 1}/ ${totalOutputs}`);

		// save metadata
		fs.writeFileSync(
			`${dir.outputs}/metadata/${index + 1}.json`,
			JSON.stringify({
				name: `punk ${index}`,
				attributes: drawableTraits,
			})
			// (err: any) => {
			// 	return undefined;
			// 	if (err) {
			// 		throw err;
			// 	};
			// }
		);

		// save image
		fs.writeFileSync(
			`${dir.outputs}/punks/${index + 1}.png`,
			canvas.toBuffer('image/png')
		);
	};

	recreateOutputsDir();

	main(amount);
}
