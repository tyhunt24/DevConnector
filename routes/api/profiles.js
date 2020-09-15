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

    // destructure from the req.body
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if (website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        // ! how does this work makes an array, at the comma and trims all the white spaces?
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //build social object
    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube;
    if(facebook) profileFields.social.facebook = facebook;
    if(twitter) profileFields.social.twitter = twitter;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedin) profileFields.social.linkedin = linkedin;

    try {
        //finds the profile with the users id
        let profile = await Profile.findOne({user: req.user.id})

        //finds profile and updates it
        if(profile) {
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id}, 
                {$set: profileFields},
                {new: true})

                return res.json(profile)
        }
      

        //Create a new profile
        // ! how does the instance know it needs the profile fields
        profile = new Profile(profileFields);
        // saves the profile to the database
        await profile.save();
        res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server error")
    }
})

// @route   GET api/profile/
// @desc    Get all profiles
// @access  Public
router.get("/", async(req, res) => {
    try {
        //finds all profiles and adds the users username and avatar to it. 
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

// @route   GET api/profile/user/userid
// @desc    Get profile by user id
// @access  Public

router.get("/user/:user_id", async (req, res) => {
   try {
       // ! finds the user with the same id in the url
    const profile = await Profile.findOne({user: req.params.user_id}).populate("user", ['name', 'avatar'])
    
    // returns if user isnt found
    if(!profile) return res.status(400).json({msg: 'Profile not found'})
//sends the user back 
    res.json(profile)
   } catch (err) {
       console.error(err.message)
       if(err.kind == 'ObjectId') {
        return res.status(400).json({msg: 'Profile not found'})
       }
       res.status(500).send("Server Error")
   }

    const profile = await Profile.findOne({user: req.params.user_id}).populate("user", ['name', 'avatar'])
})



module.exports = router;