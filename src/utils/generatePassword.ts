import bcrypt from 'bcrypt';
const SALT: number | any = process.env.SALT;
const PASSWORD_HASH: number | any = process.env.PASSWORD_HASH;

export async function generatePassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(Number(SALT));
  return await bcrypt.hash(password, salt);
}

export function transcriptPassword(password: string): string {
  return password
    .split('')
    .map((l) => String.fromCharCode(l.charCodeAt(0) ^ PASSWORD_HASH))
    .join('');
}
