const createError = require('http-errors');

function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details?.map((d) => d.message) || ['Validation error'];
      return next(createError(400, details.join(', ')));
    }

    req[property] = value;
    return next();
  };
}

module.exports = validate;
