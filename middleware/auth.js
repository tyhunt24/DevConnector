const jwt = require("jsonwebtoken")
const config = require("config")

//json web token 
module.exports = function(req, res, next) {
    // get token from the header
    const token = req.header("x-auth-token")

    // Check if no token 
    if(!token) {
        return res.status(401).json({msg: "No token, authorization denied"})
    }
        //verify token
        try {
            const decoded = jwt.verify(token, config.get('jwtSecret'))

            // ? sends the correct token to match the user id
            req.user = decoded.user;

            next();
        } catch (error) {
            res.status(401).json({msg: "Token is not valid"})
        }
    
}