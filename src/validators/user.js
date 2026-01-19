const Joi = require('joi');

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().max(100).required(),
});

module.exports = {
  updateProfileSchema,
};
