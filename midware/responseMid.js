const express = require('express');
const app = express();

responseMid = (req, res, next) => {

    res.success = (result) => {
        res.send({
            code: 1,
            data: result,
            msg: "请求成功"
        })
    };

    res.fail = (msg) => {
        res.send({
            code: 0,
            msg: msg
        })
    };

    next();
}

module.exports = responseMid;