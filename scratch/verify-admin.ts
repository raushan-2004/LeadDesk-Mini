import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx !== -1) {
    const key = trimmed.substring(0, eqIdx).trim();
    const val = trimmed.substring(eqIdx + 1).trim();
    process.env[key] = val;
  }
}

const MONGODB_URI = process.env.MONGODB_URI!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

console.log('=== VERIFY ADMIN SCRIPT ===');
console.log('MONGODB_URI:', MONGODB_URI);
console.log('ADMIN_EMAIL:', ADMIN_EMAIL);
console.log('ADMIN_PASSWORD:', ADMIN_PASSWORD);

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('\n✔ Connected to MongoDB');

  // Show all databases being used
  const db = mongoose.connection.db!;
  const dbName = db.databaseName;
  console.log('Database name:', dbName);

  // Find admin user
  const collection = db.collection('adminusers');
  const user = await collection.findOne({ email: ADMIN_EMAIL });

  if (!user) {
    console.log('\n❌ No admin user found with email:', ADMIN_EMAIL);
    console.log('   Collections in this database:');
    const cols = await db.listCollections().toArray();
    cols.forEach(c => console.log('  -', c.name));
  } else {
    console.log('\n✔ Admin user found:', {
      name: user.name,
      email: user.email,
      role: user.role,
      passwordHashPrefix: user.passwordHash?.substring(0, 20) + '...',
    });

    const match = await bcrypt.compare(ADMIN_PASSWORD, user.passwordHash);
    console.log('\n' + (match ? '✔ Password MATCHES!' : '❌ Password does NOT match'));
  }

  await mongoose.disconnect();
}

main().catch(console.error);
