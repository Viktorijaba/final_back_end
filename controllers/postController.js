const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const Post = require("../schemas/postSchema");

module.exports = {
     createPost: async (req, res) => {
        const { title, image, description } = req.body;


        const username = req.user?.username;


        const time = new Date().toISOString();


        if (!title || !image || !description) {
            return res.status(400).send({ success: false, message: "All fields are required" });
        }

        try {
            const newPost = new Post({
                title,
                image,
                description,
                time,
                username
            });

            await newPost.save();

            res.send({ success: true, post: newPost });
        } catch (err) {
            console.error("Failed to create post:", err);
            res.status(500).send({ success: false, message: "Post creation failed" });
        }
    },

    getAllPosts: async (req, res) => {
        const posts = await Post.find();
        res.send(posts);
    },

    getPostById: async (req, res) => {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) return res.status(404).send({ message: "Post not found" });
        res.send(post);
    },

    addComment: async (req, res) => {
        const { id } = req.params;
        const { comment } = req.body;
        const username = req.user.username;

        const post = await Post.findById(id);
        if (!post) return res.status(404).send({ message: "Post not found" });

        post.comments.push({ username, comment });
        await post.save();

        res.send({ success: true, message: "Comment added", post });
    },

    addFavorite: async (req, res) => {
        const { id } = req.params;
        const username = req.user.username;

        const post = await Post.findById(id);
        if (!post) return res.status(404).send({ message: "Post not found" });

        if (!post.favorites.includes(username)) {
            post.favorites.push(username);
            await post.save();
        }

        res.send({ success: true, message: "Post added to favorites" });
    },

    removeFavorite: async (req, res) => {
        const { id } = req.params;
        const username = req.user.username;

        const post = await Post.findById(id);
        if (!post) return res.status(404).send({ message: "Post not found" });

        post.favorites = post.favorites.filter(u => u !== username);
        await post.save();

        res.send({ success: true, message: "Post removed from favorites" });
    },

    getFavoritePosts: async (req, res) => {
        const username = req.user.username;
        const posts = await Post.find({ favorites: username });
        res.send(posts);
    },

    getPostsByUsername: async (req, res) => {
        const { username } = req.params;
        const posts = await Post.find({ username });
        res.send(posts);
    }
};