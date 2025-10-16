const axios = require("axios");
const config = require("../config/env");

const logError = async (errObj) => {
  try {
    await axios.post(
      config.WEBHOOKS.LOGS,
      {
        error_message: errObj?.message || "",
        error_raw: JSON.stringify(errObj),
        error_code: errObj.statusCode || errObj.status || 0,
      },
      { headers: { Authorization: `Bearer ${config.BUBBLE_DATA_API_KEY}` } }
    );
  } catch (error) {
    console.error('Error:\n', error);
  }
};

module.exports = logError;
