import { sql } from '../db/client.js';
import bcrypt from 'bcryptjs';

async function seedTestUser() {
  const hash = await bcrypt.hash('test@1234', 10);
  const email = 'test@test.com';
  
  await sql`
    INSERT INTO users (user_id, name, email, password_hash, role, is_active)
    VALUES ('usr_test_account', 'Test User', ${email}, ${hash}, 'SuperAdmin', TRUE)
    ON CONFLICT (user_id) DO UPDATE SET email = ${email}, password_hash = ${hash}, role = 'SuperAdmin', is_active = TRUE;
  `;
  
  console.log('✅ Account test@test.com created/updated in Neon DB successfully!');
  process.exit(0);
}

seedTestUser().catch(err => {
  console.error('❌ Error seeding test user:', err);
  process.exit(1);
});
