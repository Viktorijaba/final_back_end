const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const userSchema = require("../schemas/userSchema");

module.exports = {
        register: async (req, res) => {
            const { username, password1, password2 } = req.body;

            if (password1 !== password2) {
                return res.send({ message: "Passwords do not match" });
            }

            const userExists = await userSchema.findOne({ username });
            if (userExists) {
                return res.send({ message: "User already exists" });
            }

            const salt = await bcrypt.genSalt(5);
            const hash = await bcrypt.hash(password1, salt);

            const user = {
                username,
                password: hash
            };

            const newUser = new userSchema(user);
            await newUser.save();
            const savedUser = await newUser.save();
            console.log("✅ New user registered:", savedUser);
            res.send({ ok: "ok" });
        },


    login: async (req, res) => {
        const { username, password} = req.body;

        const myUser = await userSchema.findOne({ username });

        if (!myUser) {
            return res.send( {error: true, message: "User does not exist" })
        }

        const passwordMatch = await bcrypt.compare(password, myUser.password)

            if (!passwordMatch) {
                return res.send({success: false, message: "Invalid password"});
            }

            const userData = {username: myUser.username};
            const token = jwt.sign(userData, process.env.SECRET_KEY)

        return res.send({success: true, token});
    }

};