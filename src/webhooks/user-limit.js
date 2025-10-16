const axios = require("axios");
const config = require("../config/env");

const getUserLimit = async (userID, res) => {
    try {
        const { data } = await axios.get(
            `${config.USER_INFO_ENDPOINT}/${userID}`,
            { headers: { Authorization: `Bearer ${config.BUBBLE_DATA_API_KEY}` } },
        );
        return { limitExceeded: data.response?.at_capacity };
    }
    catch (error) {
        throw error;
    }
}

module.exports = getUserLimit;