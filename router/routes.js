const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const {
    registerUser,
    loginUser,
    sendMessage,
    getUsers,
    updateUserColor
} = require("../controllers/mainController");

const {
    validateRegister,
    validateLogin
} = require("../middleware/validators");


router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.post("/sendmessage", sendMessage);
router.get("/users", verifyToken, getUsers);
router.post("/updateColor", verifyToken, updateUserColor);



module.exports = router;
