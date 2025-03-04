const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    takenBy: {
        type: String,
        default: null
    }
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
