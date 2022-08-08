import bcrypt from 'bcrypt';
const SALT: number | any = process.env.SALT;

export async function generatePassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT);
    return await bcrypt.hash(password, salt);
  }