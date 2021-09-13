const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const Post = require('../models/Post');

// @route GET api/posts
// @desc Create post
// @access private
router.get('/', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({user: req.userId}).populate('user', ['username']);
        res.json({success: true, posts})
    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, message: 'Internal server error'}); 
    }
})


// @route POST api/posts
// @desc Create post
// @access private
router.post('/', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body;

    // Simple validation
    if (!title)
    return res.status(400).json({success: false, message: 'Title is required'})

    try {
        const newPost = new Post({title, description, url, status: status || 'TO LEARN', user: req.userId})

        await newPost.save();
        
        res.json({success: true, message: 'Create succesfully'})
    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, message: 'Internal server error'}); 
    }
})


// @route PUT api/posts
// @desc Update post
// @access private
router.put('/:id', verifyToken, async (req, res) => {
    const {title, description, url, status} = req.body;

    // Simple validation
    if (!title)
    return res.status(400).json({success: false, message: 'Title is required'})

    // All good
    try {
        let updatedPost = {
            title,
            description: description || '',
            url,
            status: status || 'TO LEARN'
        }
        
        const postUpdateCondition = {_id: req.params.id, user: req.userId}
        
        updatedPost = await Post.findOneAndUpdate(postUpdateCondition, updatedPost, {new: true})
        
        // User not authorised to update post
        if (!updatedPost)
        return res.status(401).json({success: false, message: 'Post not found or user not authorised'})

        res.json({success: true, message: 'Update succesfully'})
    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, message: 'Internal server error'}); 
    }
})

// @route Delete api/posts
// @desc Delete post
// @access private
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const postDeleteCondition = {_id: req.params.id, user: req.userId};
        const  deletedPost = await Post.findOneAndDelete(postDeleteCondition);
        
        if (!postDeleteCondition)
        return res.status(401).json({success: false, message: 'Post not found or user not authorised'})

        res.json({success: true, message: 'Delete succesfully'}) 
    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, message: 'Internal server error'});  
    }
})

module.exports = router;