const validator = require("email-validator");


module.exports = {

    validateRegister: (req, res, next) => {
        const {username, password} = req.body

        if(username.length < 4 || username.length > 20) return res.send({error: true, message: "Username must be between 4 and 20 characters"})
        if(password.length < 4 || password.length > 20) return res.send({error: true, message: "Password must be between 4 and 20 characters"})

        next()
    },
    validateLogin: (req, res, next) => {
        const {username, password} = req.body

        if(username.length < 4 || username.length > 20) return res.send({error: true, message: "Username must be between 4 and 20 characters"})
        if(password.length < 4 || password.length > 20) return res.send({error: true, message: "Password must be between 4 and 20 characters"})

        next()
    }

}