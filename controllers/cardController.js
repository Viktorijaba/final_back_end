const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const Card = require("../schemas/cardSchema");

module.exports = {
    createCard: async (req, res) => {
        const { emoji, text, color} = req.body;
        if (!emoji || !text || !color) {
            return res.status(400).send({ message: "All fields are required" });
        }
        const newCard = new Card({ emoji, text, color});
        await newCard.save();
        res.status(201).send({ success: true, post: newCard });

    },
    getCards: async (req, res) => {
        const cards = await Card.find();
        res.send(cards);
    },
    // deleteCard: async (req, res) => {
    //     const {id} = req.params;
    //     const deletedCard = await Card.findOneAndDelete({ _id: id });
    //     if (!deletedCard) {
    //         return res.status(404).send({ success: false, message: "Card not found" });
    //     }
    //     res.send({ success: true, message: "Card deleted" });
    // },
    likeCard: async (req, res) => {
        const {id} = req.params;

        const updatedCard = await Card.findOneAndUpdate(
            { _id: id },
            { $inc: { likes: 1 } },
            { new: true }
        );
        if (!updatedCard) {
            return res.status(404).send({ success: false, message: "Card not found" });
        }
        res.send({ success: true, card: updatedCard });
    }

};

