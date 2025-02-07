const validator = require("email-validator");

module.exports = {
    validateRegister: (req, res, next) => {
        const { username, passwordOne, passwordTwo, email } = req.body;

        if (!username || username.length < 4 || username.length > 20) {
            return res.send({ error: true, message: "Username must be between 4 and 20 characters" });
        }


        if (!email || !validator.validate(email)) {
            return res.send({ error: true, message: "Invalid email format" });
        }


        if (!passwordOne || passwordOne.length < 4 || passwordOne.length > 20) {
            return res.send({ error: true, message: "Password must be between 4 and 20 characters" });
        }


        if (passwordOne !== passwordTwo) {
            return res.send({ error: true, message: "Passwords don't match" });
        }

        next();
    },

    validateLogin: (req, res, next) => {
        const { username, password } = req.body;


        if (!username || username.length < 4 || username.length > 20) {
            return res.send({ error: true, message: "Username must be between 4 and 20 characters" });
        }

        if (!password || password.length < 4 || password.length > 20) {
            return res.send({ error: true, message: "Password must be between 4 and 20 characters" });
        }

        next();
    }
};
