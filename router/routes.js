const express = require('express')
const router = express.Router()

const {
    login,
    register,
} = require("../controllers/mainController")

const {
    validateRegister,
    validateLogin
} = require("../middleware/validators")

const userAuth = require("../middleware/auth")

router.post("/register", register)
router.post("/login",  login)



module.exports = router