const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    avatar: {type: String, required: false},
    imageUrl: {type: String, required:false},
    timestamp: {type: Date, default: Date.now}

});

userSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(password, salt);
    return hash;
  };
  

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compareSync(password, this.password);
};
  

module.exports = mongoose.model('User', userSchema);
