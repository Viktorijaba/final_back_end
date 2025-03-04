const cors = require("cors")
const mainRouter = require("./router/routes")
const express = require("express")
const mongoose = require("mongoose")
const app = express()
require("dotenv").config()


mongoose
    .connect(process.env.MONGO_KEY)
    .then(() => {
        console.log('connected to DB');
    })
    .catch((err) => {
        console.error(err);
    });

app.use(cors())
app.use(express.json())

app.use("/", mainRouter)

app.listen(2002, () => {
    console.log('Server runs on port 2002');
})

