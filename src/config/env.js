require("dotenv").config();

module.exports = {
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT || 3000,
    BUBBLE_DATA_API_KEY: process.env.BUBBLE_DATA_API_KEY,
    BUBBLE_AUTHORIZATION_ENDPOINT: process.env.BUBBLE_AUTHORIZATION_ENDPOINT,
    USER_INFO_ENDPOINT: process.env.USER_INFO_ENDPOINT,
    WEBHOOKS: {
        LOGS: process.env.API_LOGS_ENDPOINT,
        CREATE_PDF: process.env.CREATED_PDF_ENDPOINT,
    }
}