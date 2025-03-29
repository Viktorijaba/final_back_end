const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        minlength: 4,

    },
    photo: {
        type: String,
        default: ""
    }
});


const User = mongoose.model("users", userSchema);

module.exports = User;
