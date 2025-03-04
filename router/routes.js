const express = require('express')
const router = express.Router()

const {
    register,
    login,
    createBook,
    getBooks,
    getBookById,
    takeBook,
    returnBook,
    deleteBook,
    getMyBooks,
} = require("../controllers/bookController");


const {
    validateRegister,
    validateLogin
} = require("../middleware/validators")

const userAuth = require("../middleware/auth")

router.post("/register", register);
router.post("/login", login);
router.post("/createBook", userAuth, createBook);
router.get("/getBooks", getBooks);
router.get("/getBook/:id", getBookById);
router.post("/takeBook/:id", userAuth, takeBook);
router.post("/returnBook/:id", userAuth, returnBook);
router.delete("/deleteBook/:id", userAuth, deleteBook);
router.get("/myBooks", userAuth, getMyBooks);


module.exports = router