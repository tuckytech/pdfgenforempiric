const { PORT } = require("./config/env");

const app = require("./app");

app.listen(PORT, function () {
    console.log(`Server running succcessfully running on Port http://localhost:${PORT}`);
});
