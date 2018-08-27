const fs = require('fs');
const address = require('./contracts/address/address');
const abi = require('./contracts/abi/abi');

const {network} = require('./config/config');
const Web3 = require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = fs.readFileSync('C:\\Users\\Administrator\\mnemonic\\mnemonic.txt', 'utf-8'); // 12 word mnemonic

const provider = new HDWalletProvider("vibrant creek tunnel differ guilt unusual display kit bone father enrich shuffle", network);
const web3 = new Web3(provider);

watch = async () => {
    const contract = await new web3.eth.Contract(abi, address);
    await contract.methods.transfer("0x4f20a137c4ba0f6cf3b612e011f48ab794ced1f8", 100000).send({
        from: (await web3.eth.getAccounts())[0],
        gas: 1000000
    })
    contract.events.Transfer({},function (error, event) {
        console.log(event);
    }).on("data", function (event) {
        console.log(event);
    }).on("change", function (event) {
        console.log(event);
    }).on("error", function (error) {
        console.log(error);
    });

}

watch();
