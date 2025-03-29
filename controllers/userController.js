const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../schemas/userSchema");
const Post = require("../schemas/postSchema");
const Message = require("../schemas/messageSchema");


module.exports = {

    register: async (req, res) => {
        const { username, password1, password2 } = req.body;

        if (password1 !== password2) {
            return res.send({ success: false, message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.send({ success: false, message: "Username already taken" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password1, salt);

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.send({ success: true, message: "Registration successful" });
    },

    login: async (req, res) => {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.send({ success: false, message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.send({ success: false, message: "Invalid password" });

        const token = jwt.sign(
            { username: user.username, _id: user._id },
            process.env.SECRET_KEY
        );

        res.send({ success: true, token });
    },

    updatePhoto: async (req, res) => {
        const { photo } = req.body;
        const userId = req.user._id;

        await User.findByIdAndUpdate(userId, { photo });
        res.send({ success: true, message: "Photo updated" });
    },

    updateUsername: async (req, res) => {
        const { newUsername } = req.body;
        const userId = req.user._id;

        const existingUser = await User.findOne({ username: newUsername });
        if (existingUser) return res.send({ success: false, message: "Username already taken" });

        const user = await User.findById(userId);
        if (!user) return res.send({ success: false, message: "User not found" });

        const oldUsername = user.username;


        await User.findByIdAndUpdate(userId, { username: newUsername });


        await Post.updateMany({ username: oldUsername }, { username: newUsername });


        await Post.updateMany(
            { "comments.username": oldUsername },
            { $set: { "comments.$[elem].username": newUsername } },
            { arrayFilters: [{ "elem.username": oldUsername }] }
        );

        await Post.updateMany(
            { favorites: oldUsername },
            { $set: { "favorites.$[elem]": newUsername } },
            { arrayFilters: [{ "elem": oldUsername }] }
        );

        await Message.updateMany({ sender: oldUsername }, { sender: newUsername });
        await Message.updateMany({ receiver: oldUsername }, { receiver: newUsername });

        res.send({ success: true, message: "Username updated" });
    },

    updatePassword: async (req, res) => {
        const { password1, password2 } = req.body;
        const userId = req.user._id;

        if (password1 !== password2) {
            return res.send({ success: false, message: "Passwords do not match" });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password1, salt);

        await User.findByIdAndUpdate(userId, { password: hash });
        res.send({ success: true, message: "Password updated" });
    },

    getUser: async (req, res) => {
        const { username } = req.params;

        const user = await User.findOne({ username });
        if (!user) return res.send({ success: false, message: "User not found" });

        res.send({ username: user.username, photo: user.photo });
    },
    getOwnProfile: async (req, res) => {
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).send({ message: "User not found" });

        res.send({
            username: user.username,
            photo: user.photo || ""
        });
    },
};
