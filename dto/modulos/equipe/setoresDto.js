const Joi = require('joi');

const userSchema = Joi.object({
  nome: Joi.string().required()
});

function setoresDto(data) {
  const { error, value } = userSchema.validate(data);
  if (error) {
    throw error;
  }
  return value;
}

module.exports = {
    setoresDto
};