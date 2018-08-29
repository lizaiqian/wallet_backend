const address = require('../contracts/address/address');
const abi = require('../contracts/abi/abi');
const Web3 = require('web3');
const http = require('http');
const userService = require("../service/users");

const web3 = new Web3(new Web3.providers.WebsocketProvider("wss://rinkeby.infura.io/ws"));
const contract = new web3.eth.Contract(abi, address);

const transferEvent = contract.events.Transfer({},{
    fromBlock: 0,
    toBlock: 'latest',
}, function (error, event) {
    if(error) {
        console.error(error);
    } else {
        userService.findByAddress(event.returnValues.to).then((user) => {
            // console.log(user);
            if(user !== null) {
                // http.get(`localhost?to=${event.returnValues.to}&value=${event.returnValues.value}`, function (res) {
                //     if(res.statusCode !== 200) {
                //         error = new Error("请求失败");
                //         console.error(error);
                //     }
                // })
            }
        }).catch(e => {
            console.error(e);
        });
    }
});

module.exports = transferEvent;




