const Joi = require('joi');

const userSchema = Joi.object({
  login: Joi.string().required(),
  senha: Joi.string().required()
});

function loginDto(data) {
  const { error, value } = userSchema.validate(data);
  if (error) {
    throw error;
  }
  return value;
}

module.exports = {
    loginDto
};