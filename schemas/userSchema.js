const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    money: {
        type: Number,
        default: 500
    },
});

const user = mongoose.model("users", userSchema);

module.exports = user;
