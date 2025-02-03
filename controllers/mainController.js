const { uid } = require("uid");
const { users, notifications } = require("./data");

const registerUser = (req, res) => {
    const { username, password } = req.body;

    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.send({ error: true, message: "Username already exists" });
    }

    const newUser = {
        username,
        password,
        secretKey: uid(),
    };

    users.push(newUser);
    res.send({ error: false, message: "User registered successfully" });
};

const loginUser = (req, res) => {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username);
    if (!user) {
        return res.send({ error: true, message: "Invalid username" });
    }

    if (user.password !== password) {
        return res.send({ error: true, message: "Incorrect password" });
    }

    res.send({ error: false, message: "Login successful", user });
};

const pokeUser = (req, res) => {
    const { toUser, secretKey } = req.body;

    const sender = users.find(user => user.secretKey === secretKey);
    if (!sender) {
        return res.send({ error: true, message: "Invalid secretKey" });
    }

    const targetUser = users.find(user => user.username === toUser);
    if (!targetUser) {
        return res.send({ error: true, message: "User to poke not found" });
    }

    notifications.push({
        toUser,
        fromUser: sender.username,
        date: new Date().toISOString(),
    });

    res.send({ error: false, message: `${toUser} has been poked!` });
};

const getNotifications = (req, res) => {
    const { secretKey } = req.body;

    const user = users.find(user => user.secretKey === secretKey);
    if (!user) {
        return res.send({ error: true, message: "Invalid secretKey" });
    }

    const userNotifications = notifications.filter(n => n.toUser === user.username);

    res.send({ error: false, notifications: userNotifications });
};

const getUsers = (req, res) => {
    res.send(users);
};

const deleteUser = (req, res) => {
    const { secretKey, password } = req.body;

    const user = users.find(user => user.secretKey === secretKey);
    if (!user) {
        return res.send({ error: true, message: "Invalid secretKey" });
    }

    if (user.password !== password) {
        return res.send({ error: true, message: "Incorrect password" });
    }

    const updatedUsers = users.filter(u => u.secretKey !== secretKey);
    users.length = 0;
    users.push(...updatedUsers);

    const updatedNotifications = notifications.filter(n => n.toUser !== user.username && n.fromUser !== user.username);
    notifications.length = 0;
    notifications.push(...updatedNotifications);

    res.send({ error: false, message: "User deleted successfully" });
};

module.exports = {
    registerUser,
    loginUser,
    pokeUser,
    getNotifications,
    getUsers,
    deleteUser,
};
