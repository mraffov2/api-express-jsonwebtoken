const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = mongoose.model('User')

const postSchema = new Schema({
    imageUrl: {type: String, required: true},
    likes: Number,
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    timestamp: {type: Date, default: Date.now}

});


module.exports = mongoose.model('Post', postSchema);
