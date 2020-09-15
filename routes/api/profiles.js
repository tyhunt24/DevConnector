const express = require("express")
const router = express.Router();
const auth = require('../../middleware/auth')
const {check, validationResult} = require("express-validator")

const Profile = require("../../models/Profile")
const User = require("../../models/User")

// @route   GET api/profile/me
//@desc     Get current users profile
//@access   Private
router.get("/me", auth, async (req, res) => {
    try {
        // finds the user with the same id
        const profile = await (await Profile.findOne({user: req.user.id})).populated('user', 
        ['name', 'avatar'])

        if(!profile) {
            return res.status(400).json({msg: "there is no profile for this user"});
        }

        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
});

// @route   POST api/profile/
//@desc     Create or update user profile
//@access   Private
router.post("/", [auth, [
    // required fields
    check("status", "Status is required").not().isEmpty(),
    check("skills", "Skills is required")
]], 
async (req, res) => {
    //checks for errors in the required fields
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
})



module.exports = router;