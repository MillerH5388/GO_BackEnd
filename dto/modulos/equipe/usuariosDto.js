const Joi = require('joi');

const userSchema = Joi.object({
  nome: Joi.string().required(),
  login: Joi.string().required(),
  senha: Joi.string().required(),
  setores: Joi.array().items(Joi.number().integer()).min(1).required(),
  permissoes: Joi.array().items(Joi.number().integer())
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