const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    pokeUser,
    getNotifications,
    getUsers,
    deleteUser
} = require("../controllers/mainController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/poke", pokeUser);
router.post("/getnotifications", getNotifications);
router.get("/users", getUsers);
router.post("/deleteUser", deleteUser);

module.exports = router;
