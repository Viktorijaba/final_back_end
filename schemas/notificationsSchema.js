const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    receiver: { type: String, required: true },
    sender: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model("notifications", notificationSchema);
module.exports = Notification;
