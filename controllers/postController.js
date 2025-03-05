const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const Post = require("../schemas/postSchema");

module.exports = {
    createPost: async (req, res) => {
        const { title, image, description } = req.body;
        if (!title || !image || !description) {
            return res.status(400).send({ message: "All fields are required" });
        }
        const newPost = new Post({ title, image, description });
        await newPost.save();
        res.status(201).send({ success: true, post: newPost });

},
     getPosts: async (req, res) => {
         const posts = await Post.find();
         res.send(posts);
     },
    deletePost: async (req, res) => {
        const {id} = req.params;
        const deletedPost = await Post.findOneAndDelete({ _id: id });
        if (!deletedPost) {
            return res.status(404).send({ success: false, message: "Post not found" });
        }
        res.send({ success: true, message: "Post deleted" });
    },
    updatePost: async (req, res) => {
        const {id} = req.params;
        const { title, image, description } = req.body;

        const updatedPost = await Post.findOneAndUpdate(
            { _id: id },
            { $set: { title, image, description } },
            { new: true }
        );
        if (!updatedPost) {
            return res.status(404).send({ success: false, message: "Post not found" });
        }
        res.send({ success: true, message: "Post updated", post: updatedPost });
    }

};

