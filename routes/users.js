const express = require('express');
const fs = require('fs');
const router = express.Router();
const userService = require('../service/users');
const address = require('../contracts/address/address');
const abi = require('../contracts/abi/abi');

const {network, mainMne} = require('../config/config');
const Web3 = require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");
// const mnemonic = fs.readFileSync('C:\\Users\\Administrator\\mnemonic\\mnemonic.txt', 'utf-8'); // 12 word mnemonic

const provider = new HDWalletProvider(mainMne, network);
const web3 = new Web3(provider);

//装载主账户
web3.eth.getAccounts().then((res) => {
    userService.createUser(0, res);
});

//装载智能合约
const contract = new web3.eth.Contract(abi, address);

//为用户生成子地址，如果存在直接获取
router.get('/address/:id', async (req, res, next) => {
    const id = req.params.id;
    let findUser;
    try {
        if(id == 0) throw Error;
        findUser = await userService.findById(id);
    } catch (e) {
        res.fail("--------------id无效--------------");
        return;
    }

    if (findUser !== null) {
        res.success(findUser.address);
    } else {
        web3.setProvider(new HDWalletProvider(mainMne, network, id));
        const account = (await web3.eth.getAccounts())[0];
        await userService.createUser(id, account);
        res.success(account);
    }

});

//获取账户余额
router.get('/balance/:id', async (req, res, next) => {
    const id = req.params.id;
    let findUser;
    try {
        if(id == 0) throw Error;
        findUser = await userService.findById(id);
    } catch (e) {
        res.fail("-------------id无效-------------");
        return;
    }

    if (findUser === null) {
        res.fail("-----------无法找到该用户id------------");
        return;
    }
    const userBalance = await contract.methods.balanceOf(findUser.address).call({from: findUser.address});
    res.success(userBalance);
});

//用户的交易信息
router.get('/transactions/:id', async (req, res, next) => {
    const id = req.params.id;
    let findUser;
    try {
        if(id == 0) throw Error;
        findUser = await userService.findById(id);
    } catch (e) {
        res.fail("-------------id无效-------------");
        return;
    }

    if (findUser === null) {
        res.fail("-----------无法找到该用户id------------");
        return;
    }
    res.success(findUser.transactionHash);
});

//充值
// router.get('/charge', async (req, res, next) => {
//
// });

//提现
router.post('/putforward', async (req, res, next) => {
    const id = req.body.id;
    const value = req.body.value;
    const address = req.body.address;

    const mainAccount = await userService.mainAccount();

    //获取用户信息
    let findUser;
    try {
        if(id == 0) throw Error;
        findUser = await userService.findById(id);
    } catch (e) {
        res.fail("-------------id无效-------------");
        return;
    }
    if (findUser === null) {
        res.fail("-----------无法找到该用户id------------");
        return;
    }

    //子账户的钱充入主账户
    try {
        web3.setProvider(new HDWalletProvider(mainMne, network, id));
        const balance = await contract.methods.balanceOf(findUser.address).call({from: findUser.address});
        if (balance !== 0) {
            console.log("----------正在将子账户汇入主账户-----------");
            await contract.methods.transfer(mainAccount, balance).send({from: findUser.address, gas: "1000000"});
            console.log("----------将子账户汇入主账户成功-----------");
        }
    } catch (e) {
        console.log(e);
        res.fail("---------没有足够的以太币支付gas, 提现失败---------");
        return;
    }

    //主账户提现到用户账户
    try {
        web3.setProvider(new HDWalletProvider(mainMne, network));
        console.log("----------正在从主账户提现到用户账户-------");
        await contract.methods.transfer(address, value).send({from: mainAccount, gas: "1000000"});
        console.log("----------从主账户提现到用户账户成功-------");

        const customerBalance = await contract.methods.balanceOf(address).call({from: mainAccount});
        res.success({
            address: address,
            balance: customerBalance
        });
    } catch (e) {
        res.fail("----------账户提现失败--------------")
        return;
    }

});

module.exports = router;
