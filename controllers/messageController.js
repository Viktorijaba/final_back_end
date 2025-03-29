const Message = require("../schemas/messageSchema");

module.exports = {

    sendMessage: async (req, res) => {
        const from = req.user.username;
        const { to, content } = req.body;

        const newMessage = new Message({
            sender: from,
            receiver: to,
            message: content
        });

        await newMessage.save();

        res.send({ success: true, message: "Message sent" });
    },

    getMyMessages: async (req, res) => {
        const username = req.user.username;

        const myMessages = await Message.find({ receiver: username }).sort({ timestamp: -1 });

        const formatted = myMessages.map((msg) => ({
            id: msg._id,
            from: msg.sender,
            to: msg.receiver,
            content: msg.message,
            date: msg.timestamp
        }));

        res.send(formatted);
    },

    deleteMessage: async (req, res) => {
        const { id } = req.params;
        const username = req.user.username;

        const message = await Message.findOne({ _id: id });

        if (!message || message.receiver !== username) {
            return res.send({ success: false, message: "Message not found or not yours" });
        }

        await Message.findByIdAndDelete(id);
        res.send({ success: true, message: "Message deleted" });
    }
};
