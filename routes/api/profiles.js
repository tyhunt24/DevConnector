// Get all dependencies
const express = require("express")
const router = express.Router();
const request = require("request")
const config = require("config")
const auth = require('../../middleware/auth')
const {
    check,
    validationResult
} = require("express-validator")

const Profile = require("../../models/Profile")
const User = require("../../models/User")

// @route   GET api/profile/me
//@desc     Get current users profile
//@access   Private
router.get("/me", auth, async (req, res) => {
    try {
        // finds the user with the same id
        const profile = await (await Profile.findOne({
            user: req.user.id
        })).populated('user',
            ['name', 'avatar'])

        if (!profile) {
            return res.status(400).json({
                msg: "there is no profile for this user"
            });
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
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
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
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            // ! how does this work makes an array, at the comma and trims all the white spaces?
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        //build social object
        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;

        try {
            //finds the profile with the users id
            let profile = await Profile.findOne({
                user: req.user.id
            })

            //finds profile and updates it
            if (profile) {
                profile = await Profile.findOneAndUpdate({
                    user: req.user.id
                }, {
                    $set: profileFields
                }, {
                    new: true
                })

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
router.get("/", async (req, res) => {
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
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate("user", ['name', 'avatar'])

        // returns if user isnt found
        if (!profile) return res.status(400).json({
            msg: 'Profile not found'
        })
        //sends the user back 
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(400).json({
                msg: 'Profile not found'
            })
        }
        res.status(500).send("Server Error")
    }
})

// @route   DELETE api/profile
// @desc    Delete a profile, user and posts
// @access  Private
router.delete("/", auth, async (req, res) => {
    try {
        //deletes profile at that users id
        await Profile.findOneAndRemove({
            user: req.user.id
        })
        //deletes User at the users id
        await User.findOneAndRemove({
            _id: req.user.id
        })
        // todo - remove users posts

        res.json({
            msg: "User Deleted"
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

// @route   PUT api/profile/experience
// @desc    Adding profile experience
// @access  Private
router.put("/experience", [auth,
    [
        // checks for errors
        check("title", "Title is required").not().isEmpty(),
        check("company", "Company is required").not().isEmpty(),
        check("From", "From Date is required").not().isEmpty(),
    ]
], async (req, res) => {
    //checks for errors
    const errors = validationResult(req)
    if(!errors.isEmpty) {
        return res.status(400).json({errors: errors.array()})
    }

    //destructor everything in the req.body
    const {title, company, location, from, to, current, description} = req.body;
    //puts everything the user submits into an object
    const newExp = {title, company, location, from, to, current, description}
    
    try {
        //finds the profile with the same users id
        const profile = await Profile.findOne({user: req.user.id});

        //pushes the users experience to the top
        profile.experience.unshift(newExp);
        //saves the users experience
       await profile.save()
        //sends back the user json
       res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete profile experience
// @access  Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
    try {
          //finds the profile with the same users id
          const profile = await Profile.findOne({user: req.user.id});

          //Get the id of the experience we want to remove
          const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

          //at remove index delete what is there
          profile.experience.splice(removeIndex, 1)

          //save the updated experience
          await profile.save()

          //send it back
          res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

// @route   PUT api/profile/education
// @desc    Adding profile education
// @access  Private
router.put("/education", [auth,
    [
        // checks for errors
        check("school", "School is required").not().isEmpty(),
        check("degree", "Degree is required").not().isEmpty(),
        check("fieldofstudy", "Field of study is required").not().isEmpty(),
        check("From", "From Date is required").not().isEmpty(),
    ]
], async (req, res) => {
    //checks for errors
    const errors = validationResult(req)
    if(!errors.isEmpty) {
        return res.status(400).json({errors: errors.array()})
    }
    
    //destructor everything in the req.body
      const {school, degree, fieldofstudy, from, to, current, description} = req.body;
      //puts everything the user submits into an object
      const newEdu = {school, degree, fieldofstudy, from, to, current, description}

      try {
           //finds the profile with the same users id
           const profile = await Profile.findOne({user: req.user.id});

           //pushes the users experience to the top
           profile.education.unshift(newEdu);
           //saves the users experience
          await profile.save()
           //sends back the user json
          res.json(profile)  

      } catch (err) {
          console.error(err.message)
          res.status(500).send("Server Error")
      }
})

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete profile education
// @access  Private
router.delete("/education/:edu_id", auth, async (req, res) => {
    try {
          //finds the profile with the same users id
          const profile = await Profile.findOne({user: req.user.id});

          //Get the id of the experience we want to remove
          const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

          //at remove index delete what is there
          profile.education.splice(removeIndex, 1)

          //save the updated experience
          await profile.save()

          //send it back
          res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

// @route   GET api/profile/github/:username
// @desc    GET user repos from Github
// @access  Public
router.get("/github/:username", async (req, res) => {
    try {
        //call the uri we are looking for
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&client_id=${config.get("githubClientId")}
            &client_secret=${config.get("githubSecret")}`,
            method: "GET",
            headers: {"user-agent": "node.js"}
        }

        //request the information we are looking for
        request(options, (error, response, body) => {
            if(error) console.error(error);

            //if the status code is not 200 send a 404 error that github is not found
            if(response.statusCode !== 200) {
               return res.status(404).json({msg: "No Github profile found."})
            }
            res.json(JSON.parse(body));
        })

    
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

module.exports = router;