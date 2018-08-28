const User = require("../model/users");

const createUser = async (id, address) => {
    const user = new User({uid: id, address});
    await user.save();
};

const findById = async (id) => {
    return await User.findOne({uid: id});
};

const findByAddress = async (address) => {
    return await User.findOne({address});
};

module.exports = {
    createUser,
    findById,
    findByAddress
};

