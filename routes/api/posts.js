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

// @route   Post api/post
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

// @route   GET api/posts
//@desc     Get all posts
//@access   Private
router.get("/", auth, async (req, res) => {
    try {
        //finds all posts and sorts by newest date
        const posts = await Post.find().sort({date: -1});

        res.json(posts)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

// @route   GET api/posts/user/:id
//@desc     Get post by id
//@access   Private
router.get("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);    

        if(!post) {
            return res.status(404).json({msg: "Post not found"});
        }

        res.json(post)

    } catch (err) {
        console.error(err.message)
        if(err.kind === "ObjectId") {
            return res.status(404).json({msg: "Post not found"});
        }
        res.status(500).send("Server Error")
    }
})

// @route   DELETE api/posts/:id
//@desc     Delete a post
//@access   Private
router.delete("/:id", auth, async(req, res) => {
    try {
        // finds post by id
        const post = await Post.findById(req.params.id);    

        // checks user
        if(post.user.toString() !== req.user.id)  {
            return res.status(401).json({msg: "User not authorized"})
        }

        await post.remove()
        res.json({msg: "Post removed"})

    } catch (err) {
        console.error(err.message);
        if(err.kind === "ObjectId") {
            return res.status(404).json({msg: "Post not found"});
        }
        res.status(500).send("Server Error")
    }
})

//@route    PUT api/posts/like/:id
//@desc     Like a post
//@access   Private
router.put("/like/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        //check if posts has been liked by this user
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({msg: "Post already liked"})
        }
        
        //pushes the newest users likes up
        post.likes.unshift({user: req.user.id})

        //saves the post
        await post.save()

        //returns the json of the post
        res.json(post.likes);

    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

//@route    PUT api/posts/unlike/:id
//@desc     Like a post
//@access   Private
router.put("/unlike/:id", auth, async (req, res) => {
    try {
        //gets a post
        const post = await Post.findById(req.params.id)

        //check if posts has been liked by this user
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({msg: "Post has not been liked"})
        }
        
        //getRemoveIndex
        const removeIndex = posts.likes.map(like => like.user.toString()).indexOf(req.user.id)

        //removes the likes
        posts.likes.splice(removeIndex, 1)

        //saves the post
        await post.save()

        //returns the json of the post
        res.json(post.likes);

    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

// @route   Post api/post/comment/:id
//@desc     Comment on a post
//@access   Private
router.post("/comment/:id", [auth, [
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
        const post = await Post.findById(req.params.id);

        //creates a new post
        const newComment ={
            text: req.body.text, // ! gets this from the user typing it in
            name: user.name, // ! gets this from the user object
            avatar: user.avatar, // ! gets this from the user object
            user: req.user.id // ! this is the users id
        }

        post.comments.unshift(newComment)

        // saves a new post to correct user
        await post.save();

        res.json(post.comments)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

// @route   DELETE api/post/comment/:id/:comment_id
//@desc     Delete a comment
//@access   Private
router.get("/comment/:id/:comment_id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //pull out comment from post
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        // Make sure comment exists
        if(!comment) {
            return res.status(404).json({msg: "404 Comment does not exist"})
        }

        // check user is same as comment made
        if(comment.user.toString() !== req.user.id) {
            return res.status(401).json({msg: "User not authorized"})
        }

        //getRemoveIndex
        const removeIndex = posts.comments.map(comment => comment.user.toString()).indexOf(req.user.id)

        //removes the likes
        posts.comments.splice(removeIndex, 1)

        //saves the post
        await post.save()

        //returns the json of the post
        res.json(post.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

module.exports = router;