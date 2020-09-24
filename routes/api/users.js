const express = require("express")
const router = express.Router();
const gravatar = require("gravatar")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {
    check,
    validationResult
} = require("express-validator")
const config = require("config")

const User = require("../../models/User")

// @route   POST api/user
//@desc     Register User
//@access   Public
router.post("/", [
    // checks to make sure something is entered in the fields above
    check('name', 'Name is required').not().isEmpty(),
    check("email", "Please Include a valid email.").isEmail(),
    check('password', "Please enter a password with 6 or more characters").isLength({
        min: 6
    })
], 
async (req, res) => {
    // checks for errors in the user response
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    // destructor out of the req.body
    const {name, email, password} = req.body;

    try {
        // finds the user by email
        let user = await User.findOne({email})

        //check if the user exists
        if(user) {
            return res.status(400).json({errors: [{msg: "User already exists"}]});
        }

        //Get the users Gravatar
        const avatar = gravatar.url(email, {
            s: "200",
            r: "pg",
            d:"mm"
        })

        //create instance of a user
        user = new User({
            name,
            email,
            avatar,
            password
        })

        //Encrypt the password
        const salt = await bcrypt.genSalt(10);
        // creates a hash of the password
        user.password = await bcrypt.hash(password, salt);

        //save the user to the database
        await user.save();

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
            res.json({token}) // this has to be like this so we know to put it in localstorage
        })

    } catch (error) {
      console.error(error.message)
      res.status(500).send("Server Error")  
    }
})

module.exports = router;