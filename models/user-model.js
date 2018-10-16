const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    googleId: String,
    useremail: String,
    userrole: String,
    userdept: String
});

const User = mongoose.model('user', userSchema);

module.exports = User;