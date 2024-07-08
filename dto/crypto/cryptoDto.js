const Joi = require('joi');

const userSchema = Joi.object({
  text: Joi.string().required()
});

function cryptoDto(data) {
  const { error, value } = userSchema.validate(data);
  if (error) {
    throw error;
  }
  return value;
}

module.exports = {
    cryptoDto
};