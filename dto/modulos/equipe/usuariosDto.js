const Joi = require('joi');

const userSchema = Joi.object({
  nome: Joi.string().required(),
  login: Joi.string().required(),
  senha: Joi.string().required()
});

function usuariosDto(data) {
  const { error, value } = userSchema.validate(data);
  if (error) {
    throw error;
  }
  return value;
}

module.exports = {
    usuariosDto
};