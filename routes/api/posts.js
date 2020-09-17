// dependencies
const express = require("express")
const router = express.Router();
const {
    check,
    validationResult
} = require("express-validator")
const auth = require("../../middleware/auth")

//models
const Post = require("../../models/Post")
const Profile = require("../../models/Profile")
const User = require("../../models/User")

// @route   Post api/user
//@desc     Create a Post
//@access   Private
router.post("/", [auth, [
    check("text", "Text is required").not().isEmpty()

]], async (req, res) => {
    //Checks for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    try {
        //finds the user that is login
        const user = await User.findById(req.user.id).select("-password")

        //creates a new post
        const newPost = new Post ({
            text: req.body.text, // ! gets this from the user typing it in
            name: user.name, // ! gets this from the user object
            avatar: user.avatar, // ! gets this from the user object
            user: req.user.id // ! this is the users id
        })

        // saves a new post to correct user
        const post = await newPost.save();

        res.json(post)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }

})

module.exports = router;