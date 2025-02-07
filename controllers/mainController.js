const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { users, messages } = require("./data");

const sendMessage = (req, res) => {
    const { fromUser, toUser, message } = req.body;

    const sender = users.find(user => user.username === fromUser);
    const receiver = users.find(user => user.username === toUser);

    if (!sender || !receiver) {
        return res.send({ error: true, message: "User not found" });
    }

    messages.push({ fromUser, toUser, message, date: new Date().toISOString() });
    res.send({ error: false, message: `Message sent to ${toUser}` });
};

const registerUser = (req, res) => {
    const { username, passwordOne, email, color } = req.body;

    if (users.find(user => user.username === username)) {
        return res.send({ error: true, message: "Username already exists" });
    }

    bcrypt.genSalt(5, (err, salt) => {
        if (err) return res.send({ error: true, message: "Error generating salt" });

        bcrypt.hash(passwordOne, salt, (err, hash) => {
            if (err) return res.send({ error: true, message: "Error hashing password" });

            users.push({ username,
                email,
                passwordHash: hash,
                color: color || "#ADD8E6"
            });
            res.send({ error: false, message: "User registered successfully" });
        });
    });
};
const loginUser = (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);

    if (!user) {
        return res.send({ error: true, message: "Invalid username or password" });
    }

    bcrypt.compare(password, user.passwordHash, (err, result) => {
        if (err || !result) {
            return res.send({ error: true, message: "Incorrect password" });
        }

        const token = jwt.sign({ username: user.username, color: user.color }, process.env.SECRET_KEY, { expiresIn: "1h" });

        console.log("✅ Generated JWT Token:", token);

        // ✅ If the users array is empty, add the logged-in user
        if (!users.some(u => u.username === username)) {
            users.push(user);
        }

        res.send({ error: false, message: "Login successful", token, user });
    });
};

const updateUserColor = (req, res) => {
    const { color } = req.body;
    const username = req.user.username;

    const user = users.find(user => user.username === username);
    if (!user) {
        return res.send({ error: true, message: "User not found" });
    }

    user.color = color;

    const token = jwt.sign({ username: user.username, color: user.color }, process.env.SECRET_KEY, { expiresIn: "1h" });

    console.log("✅ User color updated:", user);

    res.send({ error: false, message: "Color updated successfully", token });
};



const getUsers = (req, res) => {
    if (users.length === 0) {
        console.log("🔹 Users list is empty, refreshing...");
        users.push(req.user);  // ✅ Re-add logged-in user
    }

    console.log("🔹 Fetching Users:", users);  // ✅ Debugging log
    res.send(users);
};


module.exports = { registerUser, loginUser, updateUserColor, sendMessage, getUsers };
