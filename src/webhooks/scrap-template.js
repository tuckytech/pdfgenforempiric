const axios = require("axios");
const config = require("../config/env");

const scrapTemplate = async (userID, next) => {
  try {
    await axios.post(
      config.WEBHOOKS.CREATE_PDF,
      {
        date: Date.now(),
        user_id: userID,
      },
      {
        headers: {
          Authorization: `Bearer ${config.BUBBLE_DATA_API_KEY}`,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = scrapTemplate;
