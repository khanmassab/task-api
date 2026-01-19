const asyncHandler = require('express-async-handler');
const { updateUserName } = require('../services/userService');

const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await updateUserName(req.user.id, req.body.name);
  res.json({ user });
});

module.exports = {
  getProfile,
  updateProfile,
};
