const createError = require('http-errors');
const { query } = require('../db');
const { hashPassword } = require('../utils/password');

function toSafeUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
  };
}

async function findUserByEmail(email) {
  const rows = await query(
    'SELECT id, name, email, password_hash, created_at FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

async function findUserById(id) {
  const rows = await query(
    'SELECT id, name, email, password_hash, created_at FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] ? toSafeUser(rows[0]) : null;
}

async function createUser({ name, email, password }) {
  const normalizedEmail = email.toLowerCase();
  const passwordHash = await hashPassword(password);
  try {
    const result = await query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, normalizedEmail, passwordHash]
    );
    return findUserById(result.insertId);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      throw createError(409, 'Email already registered');
    }
    throw err;
  }
}

async function updateUserName(id, name) {
  const result = await query('UPDATE users SET name = ? WHERE id = ?', [name, id]);
  if (result.affectedRows === 0) {
    throw createError(404, 'User not found');
  }
  return findUserById(id);
}

module.exports = {
  toSafeUser,
  findUserByEmail,
  findUserById,
  createUser,
  updateUserName,
};
