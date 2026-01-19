const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require('../services/taskService');

const create = asyncHandler(async (req, res) => {
  const task = await createTask(req.user.id, req.body);
  res.status(201).json({ task });
});

const list = asyncHandler(async (req, res) => {
  const result = await getTasks(req.user.id, req.query);
  res.json(result);
});

const update = asyncHandler(async (req, res) => {
  const taskId = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(taskId)) {
    throw createError(400, 'Invalid task id');
  }
  const task = await updateTask(req.user.id, taskId, req.body);
  res.json({ task });
});

const remove = asyncHandler(async (req, res) => {
  const taskId = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(taskId)) {
    throw createError(400, 'Invalid task id');
  }
  await deleteTask(req.user.id, taskId);
  res.status(204).send();
});

module.exports = {
  create,
  list,
  update,
  remove,
};
