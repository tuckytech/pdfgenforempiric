const jwt = require('jsonwebtoken');
const { BadRequestErrorException } = require('./custom-error');
const config = require('../config/env');

const authenticateToken = async (req, res, next) => {

    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new BadRequestErrorException("Unauthorized", 401);

        try {
            const { userID } = jwt.verify(token, config.JWT_SECRET);
            req.user = userID;
            req.access_token = token;
            next();
        } catch (error) {
            throw new BadRequestErrorException("[JWT] Invalid User's Access Token", 401);
        }

    } catch (error) {
        next(error);
    }
};

module.exports = authenticateToken;
