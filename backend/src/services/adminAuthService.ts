import { sql } from '../db/client.js';
import bcrypt from 'bcryptjs';

export interface AdminRecord {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function findAdminByEmail(email: string): Promise<AdminRecord | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const rows = await sql`
    SELECT id, name, email, password_hash, role, is_active, last_login_at, created_at, updated_at
    FROM admins
    WHERE LOWER(email) = ${normalizedEmail}
    LIMIT 1
  `;

  if (rows.length === 0) return null;
  return rows[0] as AdminRecord;
}

export async function findAdminById(id: number): Promise<AdminRecord | null> {
  const rows = await sql`
    SELECT id, name, email, password_hash, role, is_active, last_login_at, created_at, updated_at
    FROM admins
    WHERE id = ${id}
    LIMIT 1
  `;

  if (rows.length === 0) return null;
  return rows[0] as AdminRecord;
}

export async function updateAdminLastLogin(id: number): Promise<void> {
  await sql`
    UPDATE admins
    SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
  `;
}

export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(plainText, hash);
}

export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainText, salt);
}

export async function getAllAdmins(): Promise<Omit<AdminRecord, 'password_hash'>[]> {
  const rows = await sql`
    SELECT id, name, email, role, is_active, last_login_at, created_at, updated_at
    FROM admins
    ORDER BY created_at DESC
  `;
  return rows as Omit<AdminRecord, 'password_hash'>[];
}

export async function countSuperAdmins(): Promise<number> {
  const rows = await sql`
    SELECT COUNT(*)::int as count
    FROM admins
    WHERE role IN ('super_admin', 'Super Admin') AND is_active = TRUE
  `;
  return rows[0]?.count || 0;
}

export async function createAdminRecord(data: {
  name: string;
  email: string;
  password_hash: string;
  role?: string;
}): Promise<Omit<AdminRecord, 'password_hash'>> {
  const normalizedEmail = data.email.trim().toLowerCase();
  const normalizedRole = data.role === 'super_admin' || data.role === 'Super Admin' ? 'super_admin' : 'admin';

  const rows = await sql`
    INSERT INTO admins (name, email, password_hash, role, is_active)
    VALUES (${data.name.trim()}, ${normalizedEmail}, ${data.password_hash}, ${normalizedRole}, TRUE)
    RETURNING id, name, email, role, is_active, last_login_at, created_at, updated_at
  `;

  return rows[0] as Omit<AdminRecord, 'password_hash'>;
}

export async function updateAdminRecord(
  id: number,
  data: { name?: string; email?: string; role?: string; is_active?: boolean }
): Promise<Omit<AdminRecord, 'password_hash'> | null> {
  const existing = await findAdminById(id);
  if (!existing) return null;

  const newName = data.name !== undefined ? data.name.trim() : existing.name;
  const newEmail = data.email !== undefined ? data.email.trim().toLowerCase() : existing.email;
  const newRole = data.role !== undefined ? (data.role === 'super_admin' || data.role === 'Super Admin' ? 'super_admin' : 'admin') : existing.role;
  const newActive = data.is_active !== undefined ? Boolean(data.is_active) : existing.is_active;

  const rows = await sql`
    UPDATE admins
    SET name = ${newName}, email = ${newEmail}, role = ${newRole}, is_active = ${newActive}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING id, name, email, role, is_active, last_login_at, created_at, updated_at
  `;

  return rows[0] as Omit<AdminRecord, 'password_hash'>;
}

export async function updateAdminStatusRecord(id: number, is_active: boolean): Promise<boolean> {
  const result = await sql`
    UPDATE admins
    SET is_active = ${is_active}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
  `;
  return true;
}

export async function resetAdminPasswordRecord(id: number, password_hash: string): Promise<boolean> {
  await sql`
    UPDATE admins
    SET password_hash = ${password_hash}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
  `;
  return true;
}

export async function deleteAdminRecord(id: number): Promise<boolean> {
  await sql`
    DELETE FROM admins
    WHERE id = ${id}
  `;
  return true;
}
