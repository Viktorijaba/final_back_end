const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const userSchema = require("../schemas/userSchema");
const usersOnline = require("../modules/usersOnline")
const User = require("../schemas/userSchema");


module.exports = {
    register: async (req, res) => {
        try {
            const {username, password} = req.body;
            console.log("Received register request:", req.body); // ✅ Debug Log

            if (!username || !password) {
                return res.status(400).json({success: false, message: "All fields are required"});
            }

            const userExists = await userSchema.findOne({username});
            if (userExists) {
                return res.status(400).json({success: false, message: "User already exists"});
            }

            // 🔹 Ensure password is a valid string
            if (typeof password !== "string" || password.trim() === "") {
                return res.status(400).json({success: false, message: "Invalid password format"});
            }

            // 🔹 Fix bcrypt hashing issue
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            const newUser = new userSchema({username, password: hash});
            await newUser.save();

            console.log("✅ New user registered:", newUser);
            res.status(201).json({success: true, message: "User registered successfully"});
        } catch (err) {
            console.error("❌ Error during registration:", err);
            res.status(500).json({success: false, error: err.message});
        }
    },

    login: async (req, res) => {
        const {username, password} = req.body;

        const myUser = await userSchema.findOne({username});

        if (!myUser) {
            return res.send({error: true, message: "User does not exist"})
        }

        const passwordMatch = await bcrypt.compare(password, myUser.password)

        if (!passwordMatch) {
            return res.send({success: false, message: "Invalid password"});
        }

        let user = {
            username: myUser.username,
            _id: myUser._id
        }
        delete user.password
        const token = jwt.sign(user, process.env.SECRET_KEY)

        return res.send({success: true, token});
    },

    getUsers: async (req, res) => {
        try {
            const users = await User.find({}, {password: 0});  // Exclude password
            res.json({success: true, users});
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
};

    // updateUser: async (req, res) => {
    //     const { id } = req.params;
    //     const { image, username } = req.body;
    //
    //     const userExists = await User.findOne({ username });
    //     if (userExists && userExists._id.toString() !== id) {
    //         return res.status(400).send({ success: false, message: "Username already taken" });
    //     }
    //
    //     const updatedUser = await User.findOneAndUpdate(
    //         { _id: id },
    //         { $set: { image, username } },
    //         { new: true }
    //     );
    //
    //     if (!updatedUser) {
    //         return res.status(404).send({ success: false, message: "User not found" });
    //     }
    //
    //     res.send({ success: true, message: "User info updated", user: updatedUser });
    // },

    // getProfile: async (req, res) => {
    //     const { username } = req.body.user;
    //     const user = await User.findOne({ username });
    //
    //     if (!user) return res.status(404).send({ message: "User not found" });
    //
    //     res.send(user);
    // },
    //      addFavorite: async (req, res) => {
    //     const {username} = req.params;
    //     const {user} =req.body;
    //          const loggedInUser = await User.findById(user._id);
    //          if (!loggedInUser) return res.status(404).send({ message: "User not found" });
    //
    //          if (!loggedInUser.favorites.includes(username)) {
    //              loggedInUser.favorites.push(username);
    //              await loggedInUser.save();
    //              await User.findOneAndUpdate(
    //                  { username },
    //                  { $inc: { subscribers: 1 } }
    //              );
    //              await new Notification({ receiver: username, sender: loggedInUser.username }).save();
    //          }
    //
    //          res.send({ success: true, message: "User added to favorites" });
    //      },
    // removeFavorite: async (req, res) => {
    //     const { username } = req.params;
    //     const { user } = req.body;
    //
    //     const loggedInUser = await User.findById(user._id);
    //     if (!loggedInUser) return res.status(404).send({ message: "User not found" });
    //
    //     loggedInUser.favorites = loggedInUser.favorites.filter(fav => fav !== username);
    //     await loggedInUser.save();
    //     await User.findOneAndUpdate(
    //         { username },
    //         { $inc: { subscribers: -1 } }
    //     );
    //     await Notification.deleteOne({ receiver: username, sender: loggedInUser.username });
    //
    //     res.send({ success: true, message: "User removed from favorites" });
    // },

    // getFavorites: async (req, res) => {
    //     const { user } = req.body;
    //
    //     const loggedInUser = await User.findById(user._id);
    //     if (!loggedInUser) return res.status(404).send({ message: "User not found" });
    //
    //     const favoriteUsers = await User.find({ username: { $in: loggedInUser.favorites } });
    //
    //     res.send(favoriteUsers);
    // },
    // getNotifications: async (req, res) => {
    //     const { user } = req.body;
    //
    //     const notifications = await Notification.find({ receiver: user.username }).sort({ createdAt: -1 });
    //     res.send({ count: notifications.length, notifications: notifications || [] });
    // },
    //
    // deleteNotification: async (req, res) => {
    //     const { id } = req.params;
    //
    //     const deleted = await Notification.findByIdAndDelete(id);
    //     if (!deleted) return res.status(404).send({ message: "Notification not found" });
    //
    //     res.send({ success: true, message: "Notification deleted" });
    // },
    // deleteUser: async (req, res) => {
    //     const { user } = req.body;
    //     const { password } = req.body;
    //
    //     const myUser = await User.findById(user._id);
    //     if (!myUser) return res.status(404).send({ message: "User not found" });
    //
    //     const passwordMatch = await bcrypt.compare(password, myUser.password);
    //     if (!passwordMatch) {
    //         return res.status(400).send({ message: "Incorrect password" });
    //     }
    //
    //     await User.findByIdAndDelete(user._id);
    //
    //     const notifications = await Notification.find();
    //     for (let notification of notifications) {
    //         if (notification.receiver === myUser.username || notification.sender === myUser.username) {
    //             await Notification.findByIdAndDelete(notification._id);
    //         }
    //     }
    //     const users = await User.find();
    //     for (let u of users) {
    //         if (u.favorites.includes(myUser.username)) {
    //             u.favorites = u.favorites.filter(name => name !== myUser.username);
    //             u.subscribers = Math.max(0, u.subscribers - 1);
    //             await u.save(); // Save updated user
    //         }
    //     }
    //     res.send({ success: true, message: "User deleted successfully" });
    // }
    //

