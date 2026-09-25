import dotenv from 'dotenv';
dotenv.config();

import readline from 'readline';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.ts';
import { dbStorage } from '../services/dbStorage.ts';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
  console.log('\n=== CREATE SUPER ADMINISTRATOR ACCOUNT ===');
  await connectDB();
  await dbStorage.init();

  const name = await question('Admin Full Name [Super Admin]: ') || 'Super Admin';
  const email = (await question('Admin Email Address [admin@imanrelief.org]: ') || 'admin@imanrelief.org').trim().toLowerCase();
  const password = await question('Admin Password [min 6 chars]: ') || 'Password123!';

  if (password.length < 6) {
    console.error('Password must be at least 6 characters');
    rl.close();
    process.exit(1);
  }

  const existing = await dbStorage.findOne('users', { email });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  if (existing) {
    await dbStorage.findByIdAndUpdate('users', String(existing._id || existing.id), {
      name,
      password: hashedPassword,
      role: 'super_admin',
      isActive: true,
    });
    console.log(`\nExisting user with email ${email} has been updated to Super Admin.`);
  } else {
    await dbStorage.create('users', {
      name,
      email,
      password: hashedPassword,
      role: 'super_admin',
      isActive: true,
    });
    console.log(`\nSuper Admin account for ${email} created successfully!`);
  }

  rl.close();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
