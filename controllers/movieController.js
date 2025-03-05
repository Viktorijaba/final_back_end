const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const Movie = require("../schemas/movieSchema");

module.exports = {
    createMovie: async (req, res) => {
        const { title, image} = req.body;
        if (!title || !image) {
            return res.status(400).send({ message: "All fields are required" });
        }
        const newMovie = new Movie({ title, image});
        await newMovie.save();
        res.status(201).send({ success: true, movie: newMovie });

    },
    getMovies: async (req, res) => {
        const movies = await Movie.find();
        res.send(movies);
    },

     getMovieById: async (req, res) => {
         const {id} = req.params;
         const movie = await Movie.findById(id);
         if (!movie) return res.status(404).send({message: "Movie not found"});
         res.send(movie);
     },

    reserveSeat: async (req, res) => {
        const {id} = req.params;
        const {seatIndex, name} = req.body;
        const movie = await Movie.findById(id);
        if (!movie) return res.status(404).send({message: "Movie not found"});

        if (movie.reservedSeats.find(seat => seat.seatIndex === seatIndex)) {
            return res.status(400).send({ message: "Seat already reserved" });
        }

        movie.reservedSeats.push({seatIndex, name});
        await movie.save();

        res.send({success: true, movie});
    }
};

