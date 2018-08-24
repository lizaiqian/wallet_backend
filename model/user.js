const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    uid: {
        type: Number,
        require: true
    },
    address: {
        type: String
    },
    privateKey: String,
    transactionHash: [String]
    // keyStore: String
});

const User = mongoose.model("user", userSchema);
module.exports = User;