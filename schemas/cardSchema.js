const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    emoji: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
});

const Card = mongoose.model("cards", cardSchema);

module.exports = Card;
