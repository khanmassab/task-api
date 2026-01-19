const express = require('express');
const { create, list, update, remove } = require('../controllers/taskController');
const validate = require('../middleware/validate');
const {
  createTaskSchema,
  updateTaskSchema,
  listTaskQuerySchema,
} = require('../validators/task');

const router = express.Router();

router.get('/', validate(listTaskQuerySchema, 'query'), list);
router.post('/', validate(createTaskSchema), create);
router.patch('/:id', validate(updateTaskSchema), update);
router.delete('/:id', remove);

module.exports = router;
