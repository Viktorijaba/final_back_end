const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {

    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).send({ message: "Forbidden: No valid token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).send({ message: "Invalid or expired token" });
    }
};

module.exports = userAuth;
