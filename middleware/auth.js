const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    const userToken = req.headers.authorization

    jwt.verify(userToken, process.env.SECRET_KEY,  (err, item) => {

        if(err) return res.send({success: false})
        if(!item) return res.send({success: false})

        req.body.user = item

        next()
    })
}