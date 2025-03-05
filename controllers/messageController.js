const Message = require("../schemas/messageSchema");

module.exports = {
    sendMessage: async (req, res) => {
        try {
            const {sender, receiver, message} = req.body;

            if (!sender || !receiver || !message) {
                return res.status(400).json({success: false, message: "All fields are required"});
            }

            const newMessage = new Message({sender, receiver, message});
            await newMessage.save();

            res.status(201).json({success: true, message: newMessage});
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    },

    getMessages: async (req, res) => {
        try {
            const {userId, receiverId} = req.params;

            console.log("📥 Fetching messages between:", userId, "and", receiverId);

            if (!userId || !receiverId) {
                return res.status(400).json({success: false, message: "Invalid user data"});
            }

            const messages = await Message.find({
                $or: [
                    {sender: userId, receiver: receiverId},
                    {sender: receiverId, receiver: userId}
                ]
            }).sort({timestamp: 1});

            console.log("📤 Found messages:", messages.length);

            res.json({success: true, messages});
        } catch (err) {
            console.error("❌ Error in getMessages:", err);
            res.status(500).json({success: false, error: err.message});
        }
    },
    getUsers: async (req, res) => {
        try {
            const onlineUsers = usersOnline.getUsers(); // 🔹 Get online users from memory
            console.log("✅ Online Users from `getUsers`:", onlineUsers);

            const users = await User.find({}, { password: 0 }); // 🔹 Fetch all users from DB

            const usersWithOnlineStatus = users.map(user => ({
                username: user.username,
                id: user._id,
                online: onlineUsers.some(onlineUser => onlineUser.username === user.username)
            }));

            console.log("✅ Final Users List Sent to Frontend:", usersWithOnlineStatus);
            res.json({ success: true, users: usersWithOnlineStatus });

        } catch (err) {
            console.error("❌ Error fetching users:", err);
            res.status(500).json({ success: false, error: err.message });
        }
    }
};
