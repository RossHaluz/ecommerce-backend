const {Schema, model} = require('mongoose');
const Joi = require('joi');

const userSchema = new Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    avatar: {
        type: String,
        default: ''
    },
    token: {
        type: String,
        default: ""
    },
    password: { 
        type: String,
        require: true
    }, 
})

const UserModel = model('user', userSchema);
 
const schemaUserRegister = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const schemaUserLogin = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = {
    UserModel,
    schemaUserRegister,
    schemaUserLogin
}