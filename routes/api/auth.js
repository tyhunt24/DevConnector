const express = require("express")
const router = express.Router();
const auth = require("../../middleware/auth")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {
    check,
    validationResult
} = require("express-validator")
const config = require("config")
const User = require("../../models/User")



// @route    GET api/auth
//@desc     Gets the user with the same id
//@access   Public
router.get("/", auth, async (req, res) => {
   try {
       // gets the user information except for the password
       const user = await User.findById(req.user.id).select('-password');
       res.json(user);
   } catch (error) {
       console.error(error.message)
       res.status(500).send("Server error")
   } 
});

// @route   POST api/auth
//@desc     Authenicate User and get token
//@access   Public
router.post("/", [
    // checks to make sure something is entered in the fields above
    check("email", "Please Include a valid email.").isEmail(),
    check('password', "Password is required").exists()
],
async (req, res) => {
    // checks for errors in the user response
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    // destructor out of the req.body
    const {email, password} = req.body;

    try {
        // finds the user by email
        let user = await User.findOne({email})

        //check if the user exists
        if(!user) {
            return res.status(400).json({errors: [{msg: "invalid Credentials"}]});
        }

        // checks to make sure the passwords match
        const isMatch = await bcrypt.compare(password, user.password);

        //send this if there is no match
        if(!isMatch) {
            return res.status(400).json({errors: [{msg: "invalid Credentials"}]});
        }

        //send back the jsonwebtoken
        const payload = {
            // ! gives us the user id
            user: {
                id: user.id
            }
        }

        //sends us our token
        // ! I still need help on understanding this. 
        jwt.sign(payload, config.get("jwtSecret"), {expiresIn: 360000},
        (err, token) => {
            if(err) throw err;
            res.json({token})
        })

    } catch (error) {
      console.error(error.message)
      res.status(500).send("Server Error.")  
    }
})



module.exports = router;