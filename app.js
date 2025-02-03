const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const mainRouter = require("./router/routes");

app.use("/", mainRouter);

const PORT = 2001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
