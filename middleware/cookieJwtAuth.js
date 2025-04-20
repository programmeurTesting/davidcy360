const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const express = require('express');
const dotenv = require('dotenv').config();

const app = express();

app.use(cookieParser());
app.use(express.json());

const cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.token;

    try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(user);
        req.user = user;
        next();
    } catch (error) {
        res.clearCookie("token").status(400).send({ status: 'failed' });
    }
}




module.exports = { cookieJwtAuth };