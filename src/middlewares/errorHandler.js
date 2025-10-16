const { BadRequestErrorException } = require('./custom-error');
const executeLog = require('../webhooks/logs');

const catchError = (err, req, res, next) => {
    executeLog(err);

    console.log('\x1b[31m', '************** [Error Exception Start] *************'),
        console.log({
            error: `[${err.statusCode || err.status}] ${err.message}`,
            stack: `\n${err.stack}`,
        });
    console.log('\x1b[31m', '************** [Error Exception End] *************');

    if (err instanceof BadRequestErrorException) {
        res.status(err.statusCode).json({ message: err.message });
    } else {
        res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
}

module.exports = catchError;
