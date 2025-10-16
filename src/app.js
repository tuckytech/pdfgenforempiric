const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pdfRoute = require('./routes/generatePDF');
const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/errorHandler');
const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.use('/api/pdf', pdfRoute);

app.use(errorHandler);

module.exports = app;
