const { Router } = require('express');
const router = Router();

const path = require('path');
const { unlink } = require('fs-extra');

const Post = require('../models/post');
const verifyToken = require('../auth/verifyToken');

//Create Post
router.post('/post', verifyToken, async (req, res) => {

    try {

        if(!req.file){
            res.status(404).json({'message': 'The image is required'})
        }
        
        const imageUrl = '/' + req.file.filename;
    
        const newPost = new Post({imageUrl});
        newPost.user = req.userId;
        newPost.likes = 0;
        await newPost.save();

        res.status(201).json({'message': 'Post Saved', 'post': newPost});

    }catch(e) {
        res.status(500).json({'message': 'Internal Server error'});
    }
});

//Get posts
router.get('/posts', verifyToken, async (req, res) => {
    const posts = await Post.find().populate('user').sort('-_id');
    res.json(posts);
});

//Deleted Post
router.delete('/post/deleted/:id', verifyToken, async (req, res) => {

    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post){
            res.status(404).json({'message': 'No found'})
        }
        await unlink(path.resolve('./backend/public/' + post.imageUrl));
        res.json({message: 'Post Deleted'});
    } catch(e){
        res.status(500).json({'message': 'Internal server error'})
    } 
});

//Update Post
router.put('/post/edit/:_id', verifyToken, async (req, res) => {
    try {

        if(!req.file){
            res.status(400).json({'message': 'The file is required'});
        } 

        post = await Post.find({"_id":req.params._id}, (err, post) => {
            if (err) {
                res.status(404).json({'message': 'No found the post id'})
            } 
        });

        //unlink(path.resolve('./backend/public/uploads' + post.imageUrl))

        const imageUrl = '/' + req.file.filename;
        const postUpdate = await Post.findByIdAndUpdate(req.params._id, {imageUrl});
        res.status(201).json({'message': 'Post updated', 'post': postUpdate})

    } catch(e){
        res.status(500).json({'message': 'Internal server error', 'error': e})
    } 
});


module.exports = router;