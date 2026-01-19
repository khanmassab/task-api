const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const validate = require('../middleware/validate');
const { updateProfileSchema } = require('../validators/user');

const router = express.Router();

router.get('/me', getProfile);
router.patch('/me', validate(updateProfileSchema), updateProfile);

module.exports = router;
