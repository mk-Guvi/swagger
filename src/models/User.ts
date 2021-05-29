export {};
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const UserSchema = new Schema({
    Name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
});

const User = model('User', UserSchema);

module.exports = User;
