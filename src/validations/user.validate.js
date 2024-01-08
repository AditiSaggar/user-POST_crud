const Joi = require('joi');

const createUserSchema = Joi.object({
  userName: Joi.string().min(3).max(30).required().description("userName is required"),
  email: Joi.string().email().lowercase().required().description("email is required"),
  password: Joi.string().min(2).required(),
});

const loginUserSchema = Joi.object({    
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
});

module.exports = { createUserSchema, loginUserSchema };

