const express = require('express');
const fs = require('fs');
const router = express.Router();
const User = require('../model/user');
const address = require('../contracts/address/address');
const abi = require('../contracts/abi/abi');

const {network} = require('../config/config');
const Web3 = require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = fs.readFileSync('C:\\Users\\Administrator\\mnemonic\\mnemonic.txt', 'utf-8'); // 12 word mnemonic

const provider = new HDWalletProvider(mnemonic, network);
const web3 = new Web3(provider);
const contract = new web3.eth.Contract(abi, address);
/* GET users listing. */
router.get('/address/:id', async (req, res, next) => {
    const id = req.params.id;
    const findUser = await User.findOne({uid: id});

    if(findUser !== null) {
        res.success(findUser.address);
    } else {
        const account = web3.eth.accounts.create();
        const user = new User({uid: id, address: account.address, privateKey: account.privateKey});
        await user.save();
        res.success(account.address);
    }

});

router.get('/balance/:id', async (req, res, next) => {
    const id = req.params.id;
    const findUser = await User.findOne({uid: id});
    if(findUser === null) {
        res.fail("无法找到该用户id");
        return;
    }
    const userBalance = await contract.methods.getBalanceOf(findUser.address).call({from: findUser.address});
    res.success(userBalance);
});

router.get('/transactions/:id', async (req, res, next) => {
    const id = req.params.id;
    const findUser = await User.findOne({uid: id});
    if(findUser === null) {
        res.fail("无法找到该用户id");
        return;
    }
    res.success(findUser.transactionHash);
});

router.post('/charge', async (req, res, next) => {

    const uid = req.body.id;
    const value = req.body.value;
    const findUser = await User.findOne({uid: uid});
    if(findUser === null) {
        res.fail("无法找到该用户id");
        return;
    }

});

module.exports = router;
