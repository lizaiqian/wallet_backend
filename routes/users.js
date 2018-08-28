const express = require('express');
const fs = require('fs');
const router = express.Router();
const User = require('../model/users');
const address = require('../contracts/address/address');
const abi = require('../contracts/abi/abi');

const {network} = require('../config/config');
const Web3 = require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = fs.readFileSync('C:\\Users\\Administrator\\mnemonic\\mnemonic.txt', 'utf-8'); // 12 word mnemonic

const provider = new HDWalletProvider(mnemonic, network);
const web3 = new Web3(provider);
const mainWeb3 = new Web3(new HDWalletProvider("vibrant creek tunnel differ guilt unusual display kit bone father enrich shuffle", network));
const mainAccounts = mainWeb3.eth.getAccounts();
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
    const userBalance = await contract.methods.balanceOf(findUser.address).call({from: findUser.address});
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
    const address = req.body.address;

    //获取用户信息
    let findUser;
    try { findUser = await User.findOne({uid: id});} catch (e) {res.fail("id无效");return;}
    if(findUser === null) {
        res.fail("无法找到该用户id");
        return;
    }

    //子账户的钱充入主账户
    try {
        web3.setProvider(new HDWalletProvider(mnemonic, network, id));
        console.log(findUser.address);
        const balance = await contract.methods.balanceOf(findUser.address).call({from: findUser.address});
        console.log(balance);
        await contract.methods.transfer(mainAccounts[0], balance).send({from: findUser.address, gas: 100000});
    } catch (e) {
        console.log(e);
        res.fail("没有足够的以太币支付gas, 提现失败");
        return;
    }

    //主账户提现到用户账户
    try {
        web3.setProvider(new HDWalletProvider("vibrant creek tunnel differ guilt unusual display kit bone father enrich shuffle", network));
        await contract.methods.transfer(address, value).send({from: mainAccounts[0], gas: 100000});
        console.log("成功");
    } catch (e) {
        res.fail("账户提现失败")
        return;
    }

});

module.exports = router;
