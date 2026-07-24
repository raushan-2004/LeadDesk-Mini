import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// 1. Manually load environment variables from .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envLocalLines = fs.readFileSync(envLocalPath, 'utf8').split(/\r?\n/);
  for (const line of envLocalLines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const equalsIdx = trimmed.indexOf('=');
    if (equalsIdx !== -1) {
      const key = trimmed.substring(0, equalsIdx).trim();
      let val = trimmed.substring(equalsIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  }
}

// 2. Define the bootstrap validation schema
const bootstrapSchema = z.object({
  MONGODB_URI: z.string().trim().min(1, 'MONGODB_URI is required'),
  ADMIN_EMAIL: z
    .string()
    .trim()
    .min(1, 'ADMIN_EMAIL is required')
    .email({ message: 'ADMIN_EMAIL must be a valid email address' })
    .toLowerCase(),
  ADMIN_PASSWORD: z
    .string()
    .min(8, { message: 'ADMIN_PASSWORD must be at least 8 characters long' })
    .max(100, { message: 'ADMIN_PASSWORD cannot exceed 100 characters' }),
});

async function main() {
  console.log('--- ADMIN USER BOOTSTRAP SCRIPT ---');

  // Validate environmental configurations
  const result = bootstrapSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Configuration validation failed:');
    result.error.issues.forEach((issue) => {
      console.error(`  - ${issue.message}`);
    });
    process.exit(1);
  }

  const { ADMIN_EMAIL, ADMIN_PASSWORD } = result.data;

  try {
    // Dynamically import database and models after env variables are initialized
    const { connectToDatabase } = await import('../src/lib/db');
    const { AdminUser } = await import('../src/models/AdminUser');

    // 3. Connect database
    console.log('Connecting to database...');
    await connectToDatabase();

    // 4. Check check-before-create logic
    const existingUser = await AdminUser.findOne({ email: ADMIN_EMAIL });
    if (existingUser) {
      console.log(`✔ Admin user <${ADMIN_EMAIL}> already exists. Skipping creation.`);
      await mongoose.disconnect();
      console.log('Database connection closed safely.');
      process.exit(0);
    }

    // 5. Hash password and save admin user
    console.log('Hashing administrator password...');
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    console.log('Registering user in database...');
    await AdminUser.create({
      name: 'System Administrator',
      email: ADMIN_EMAIL,
      passwordHash: hashedPassword,
      role: 'ADMIN',
    });

    console.log(`✔ Admin user <${ADMIN_EMAIL}> created successfully.`);
    await mongoose.disconnect();
    console.log('Database connection closed safely.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed admin user:', error);
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  }
}

main();
