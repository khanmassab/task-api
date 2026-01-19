const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const { createUser, findUserByEmail, toSafeUser } = require('../services/userService');
const { comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/token');

const register = asyncHandler(async (req, res) => {
  const user = await createUser(req.body);
  const token = generateToken(user);
  res.status(201).json({ user, token });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existing = await findUserByEmail(email.toLowerCase());
  if (!existing) {
    throw createError(401, 'Invalid credentials');
  }

  const isValid = await comparePassword(password, existing.password_hash);
  if (!isValid) {
    throw createError(401, 'Invalid credentials');
  }

  const user = toSafeUser(existing);
  const token = generateToken(user);
  res.json({ user, token });
});

module.exports = {
  register,
  login,
};
