const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const Book = require("../schemas/bookSchema");
const User = require("../schemas/userSchema");

module.exports = {
    register: async (req, res) => {
        const { username, password1, password2, admin } = req.body;

        if (password1 !== password2) {
            return res.send({ success: false, message: "Passwords do not match" });
        }

        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.send({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(5);
        const hash = await bcrypt.hash(password1, salt);

        const newUser = new User({ username, password: hash, admin: !!admin });
        await newUser.save();

        res.send({ success: true, message: "Registration successful" });
    },

    login: async (req, res) => {
        const { username, password} = req.body;

        const myUser = await User.findOne({ username });

        if (!myUser) {
            return res.send({success: false, message: "User does not exist" });
        }

        const passwordMatch = await bcrypt.compare(password, myUser.password);

        if (!passwordMatch) {
            return res.send({success: false, message: "Invalid password"});
        }

        let user = {
            username: myUser.username,
            _id: myUser._id,
            admin: myUser.admin  // ✅ Make sure this is sent correctly
        };

        const token = jwt.sign(
            { username: myUser.username, _id: myUser._id, admin: myUser.admin },
            process.env.SECRET_KEY
        );

        return res.send({ success: true, token, admin: myUser.admin });  // ✅ Send `admin` back to frontend
    },

    getMyBooks: async (req, res) => {
        const { user } = req.body; // Get logged-in user

        const books = await Book.find({ takenBy: user.username }); // Find books taken by this user
        res.send(books);
    },
    createBook: async (req, res) => {
        console.log("📢 Received book data:", req.body); // ✅ Check incoming data

        const { title, image } = req.body;
        if (!title || !image) {
            console.log("❌ Missing fields:", { title, image }); // ✅ Log missing fields
            return res.status(400).send({ message: "All fields are required" });
        }

        try {
            const newBook = new Book({ title, image });
            await newBook.save();
            console.log("✅ Book saved to database:", newBook); // ✅ Log saved book

            res.status(201).send({ success: true, book: newBook });
        } catch (error) {
            console.error("❌ Error saving book:", error);
            res.status(500).send({ success: false, message: "Internal Server Error" });
        }
    },



    getBooks: async (req, res) => {
        try {
            const books = await Book.find();
            console.log("📚 Books from DB:", books); // 🔹 Debugging: Check if books exist in DB
            res.send(books);
        } catch (error) {
            console.error("Error fetching books:", error);
            res.status(500).send({ success: false, message: "Internal Server Error" });
        }
    },


    getBookById: async (req, res) => {
        const {id} = req.params;
        const book = await Book.findById(id);
        if (!book) return res.status(404).send({message: "Book not found"});
        res.send(book);
    },

    takeBook: async (req, res) => {
        const {id} = req.params;
        const {username} = req.body;
        const book = await Book.findById(id);
        if (!book) return res.status(404).send({message: "Book not found"});

        if (book.takenBy) {
            return res.status(400).send({ message: "Book already taken" });
        }

        book.takenBy = username;
        await book.save();

        res.send({ success: true, book });
    },
    returnBook: async (req, res) => {
        const { id } = req.params;

        const book = await Book.findById(id);
        if (!book) return res.status(404).send({ message: "Book not found" });

        book.takenBy = null;
        await book.save();

        res.send({ success: true, book });
    },
    deleteBook: async (req, res) => {
        const { id } = req.params;

        const book = await Book.findById(id);
        if (!book) return res.status(404).send({ message: "Book not found" });

        if (book.takenBy) {
            return res.status(400).send({ message: "Book is taken, cannot delete" });
        }

        await Book.findByIdAndDelete(id);
        res.send({ success: true, message: "Book deleted" });
    }
};

