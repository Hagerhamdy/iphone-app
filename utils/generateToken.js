const jwt = require('jsonwebtoken');

//generate token
const generateToken = (payload) =>
    jwt.sign({ userId: payload }, process.env.JWT_SECTET_KEY, { expiresIn: process.env.JWT_EXPIRE_TIME });

module.exports = generateToken;