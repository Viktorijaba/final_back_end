const express = require('express')
const router = express.Router()

const {
    createPost,
    getAllPosts,
    getPostById,
    addComment,
    addFavorite,
    removeFavorite,
    getFavoritePosts,
    getPostsByUsername
} = require("../controllers/postController");

const {
    login,
    register,
    updatePhoto,
    updateUsername,
    updatePassword,
    getUser,
    getOwnProfile
} = require("../controllers/userController");

const {
    sendMessage,
    getMyMessages,
    deleteMessage
} = require("../controllers/messageController");

const {
    validateRegister,
    validateLogin
} = require("../middleware/validators")

const userAuth = require("../middleware/auth")


router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/createPost", userAuth, createPost);
router.get("/getPosts", userAuth, getAllPosts);
router.get("/getPost/:id", userAuth, getPostById);
router.post("/comment/:id", userAuth, addComment);
router.post("/addFavorite/:id", userAuth, addFavorite);
router.post("/removeFavorite/:id", userAuth, removeFavorite);
router.get("/getFavorites", userAuth, getFavoritePosts);
router.post("/updatePhoto", userAuth, updatePhoto);
router.post("/updateUsername", userAuth, updateUsername);
router.post("/updatePassword", userAuth, updatePassword);
router.get("/getUser/:username", userAuth, getUser);
router.get("/userPosts/:username", userAuth, getPostsByUsername);
router.get("/getProfile", userAuth, getOwnProfile);
router.post("/sendMessage", userAuth, sendMessage);
router.get("/getMessages", userAuth, getMyMessages);
router.post("/deleteMessage/:id", userAuth, deleteMessage);

module.exports = router