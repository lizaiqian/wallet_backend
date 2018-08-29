const User = require("../model/users");

const createUser = async (id, address) => {
    const user = new User({uid: id, address});
    await user.save();
};

const mainAccount = async () => {
    const user = await User.findOne({uid: 0});
    return user.address;
}

const findById = async (id) => {
    return await User.findOne({uid: id});
};

const findByAddress = async (address) => {
    return await User.findOne({address});
};

module.exports = {
    createUser,
    findById,
    findByAddress,
    mainAccount
};

