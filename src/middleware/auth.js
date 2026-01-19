const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { findUserById } = require('../services/userService');

async function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const parts = header.split(' ');
  const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : null;

  if (!token) {
    return next(createError(401, 'Authorization token missing'));
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret);
    const user = await findUserById(payload.sub);
    if (!user) {
      return next(createError(401, 'User not found'));
    }
    req.user = user;
    return next();
  } catch (err) {
    return next(createError(401, 'Invalid or expired token'));
  }
}

module.exports = auth;
