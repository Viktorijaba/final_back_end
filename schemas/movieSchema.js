const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    seats: {
        type: Number,
        default: 20
    },
    reservedSeats: {
        type: Array,
        default: []
    }
});

const Movie = mongoose.model("movies", movieSchema);

module.exports = Movie;
