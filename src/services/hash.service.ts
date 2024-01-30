import * as bcrypt from "bcrypt";

import dotenv from "dotenv";

dotenv.config();

export class HashingService {
  constructor() {}

  async hash(): Promise<any> {
    const salt = await bcrypt.genSalt();

    const hash = await bcrypt.hash(process.env.HASH_SECRET, salt);

    return hash;
  }
  async isMatch(hash: string): Promise<boolean> {
    console.log(await this.hash());
    return await bcrypt.compare(process.env.HASH_SECRET, hash);
  }
}
