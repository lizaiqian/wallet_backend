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
const mainWeb3 = new Web3(new HDWalletProvider("vibrant creek tunnel differ guilt unusual display kit bone father enrich shuffle", network));
const contract = new web3.eth.Contract(abi, address);
/* GET users listing. */

//为用户生成子地址，如果存在直接获取
router.get('/address/:id', async (req, res, next) => {
    const id = req.params.id;
    let findUser;
    try { findUser = await User.findOne({uid: id});} catch (e) {res.fail("id无效");return;}

    if(findUser !== null) {
        res.success(findUser.address);
    } else {
        web3.setProvider(new HDWalletProvider(mnemonic, network, id));
        const account = (await web3.eth.getAccounts())[0];
        const user = new User({uid: id, address: account});
        await user.save();
        res.success(account);
    }

});

//获取账户余额
router.get('/balance/:id', async (req, res, next) => {
    const id = req.params.id;
    let findUser;
    try { findUser = await User.findOne({uid: id});} catch (e) {res.fail("id无效");return;}

    if(findUser === null) {
        res.fail("无法找到该用户id");
        return;
    }
    const userBalance = await contract.methods.getBalanceOf(findUser.address).call({from: findUser.address});
    res.success(userBalance);
});

//用户的交易信息
router.get('/transactions/:id', async (req, res, next) => {
    const id = req.params.id;
    let findUser;
    try { findUser = await User.findOne({uid: id});} catch (e) {res.fail("id无效");return;}

    if(findUser === null) {
        res.fail("无法找到该用户id");
        return;
    }
    res.success(findUser.transactionHash);
});

//充值
router.get('/charge', async (req, res, next) => {

});

//提现
router.post('/putforward', async (req, res, next) => {
    const id = req.body.id;
    const value = req.body.value;

    let findUser;
    try { findUser = await User.findOne({uid: id});} catch (e) {res.fail("id无效");return;}
    if(findUser === null) {
        res.fail("无法找到该用户id");
        return;
    }

    web3.setProvider(new HDWalletProvider("vibrant creek tunnel differ guilt unusual display kit bone father enrich shuffle", network));
    const accounts = await web3.eth.getAccounts();

    await contract.methods.transfer(findUser.address, value).send({from: accounts[0], gas: 100000});
    console.log("成功")

});

module.exports = router;
