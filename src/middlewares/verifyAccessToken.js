const axios = require('axios');
const getUserLimit = require('../webhooks/user-limit');
const { BadRequestErrorException } = require('./custom-error');
const config = require('../config/env');

const verifyAccessToken = async (req, res, next) => {

  try {
    const { data } = await axios.post(
      `${config.BUBBLE_AUTHORIZATION_ENDPOINT}`,
      {
        user_id: req.user,
        access_token: req.access_token,
      },
      {
        headers: {
          Authorization: `Bearer ${config.BUBBLE_DATA_API_KEY}`,
        },
      }
    );
    if (data.status === 'NOT_RUN') {
      throw new BadRequestErrorException(data.message);
    } else {
      const userLimit = await getUserLimit(req.user, res);
      if (userLimit.limitExceeded) {
        throw new BadRequestErrorException('Number of pdf generations exceeded - please upgrade', 402);
      }
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = verifyAccessToken;
