const { Router } = require('express');
const router = Router();

const jwt = require('jsonwebtoken');

const User = require('../models/user');
const verifyToken = require('../auth/verifyToken');

router.post('/register', async (req, res) => {

    try {
        const { name, last_name, email, password } = req.body;
        user = await User.findOne({'email': email})
        
        if (user) {
            res.status(404).json('The email is already registerd')
        }

        const newUser = new User({name, last_name, email, password});
        newUser.password  = await newUser.encryptPassword(password)
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.json({'message': 'User Saved', 'token': token});

    }catch(e) {
        res.status(404).json({'message': e});
    }
});

router.get('/user', verifyToken, async (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ 'auth': false, 'message': 'No token provided' });
    try {
        
        const user = await User.findById(req.userId, { password: 0});
        if (!user) return res.status(404).json('User Not Found');
        res.status(200).json([user]);

    } catch (e) {
        return res.status(500).json({ 'auth': false, 'message': 'Failed to authenticate token' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ 'email': req.body.email });
        if (!user) {
            res.status(404).json('User not found')
        }

        if (!user.matchPassword(req.body.password)) {
             res.status(401).json({ 'auth': false, 'token': null, 'message': 'Email or password incorrect' })
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: 86400
        });
        res.status(200).json({' auth': true, 'token': token });
    } catch (e) {
        return res.status(500).json('Internal server error');
    }
});

module.exports = router;