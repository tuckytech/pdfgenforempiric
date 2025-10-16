const axios = require("axios");

const executeWebhook = async (req, pdf, next) => {
  const bearerToken = req.headers["x-webhook-auth"];
  try {
    const { webhook, id, file_name, make_file_private, thing_id } = req.body;

    const fileObject = {
      filename: `${file_name || "page"}.pdf`,
      contents: pdf,
      private: make_file_private,
    }

    if (make_file_private) {
      fileObject["attach_to"] = thing_id;
    }

    const headers = {};
    if (bearerToken) {
      headers.Authorization = bearerToken;
    }

    await axios.post(webhook, { id: id || "", pdf: fileObject, }, { headers });
  } catch (error) {
    if (!bearerToken) {
      next({ ...error, message: `x-webhook-auth is empty ${error.message}` });
    } else {
      next(error);
    }
  }
};

module.exports = { executeWebhook };
