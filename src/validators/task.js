const Joi = require('joi');
const allowedStatuses = ['pending', 'in-progress', 'completed'];

const createTaskSchema = Joi.object({
  title: Joi.string().trim().max(255).required(),
  description: Joi.string().allow('', null).max(2000).optional(),
  status: Joi.string().valid(...allowedStatuses).optional(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().max(255).optional(),
  description: Joi.string().allow('', null).max(2000).optional(),
  status: Joi.string().valid(...allowedStatuses).optional(),
}).min(1);

const listTaskQuerySchema = Joi.object({
  status: Joi.string().valid(...allowedStatuses).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

module.exports = {
  allowedStatuses,
  createTaskSchema,
  updateTaskSchema,
  listTaskQuerySchema,
};
