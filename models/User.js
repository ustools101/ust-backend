const { model, models, Schema} = require("mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    points: {
        type: Number,
        default: 0,
    },
    telegramId: {
        type: Number,
    },
    role: {
        type: String,
        default: 'user',
    },
}, {
    timestamps: true
});

const User = models.User || model('User', userSchema);

module.exports = User;
