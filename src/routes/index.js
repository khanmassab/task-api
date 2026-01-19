const express = require('express');
const authMiddleware = require('../middleware/auth');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', authMiddleware, userRoutes);
router.use('/tasks', authMiddleware, taskRoutes);

module.exports = router;
