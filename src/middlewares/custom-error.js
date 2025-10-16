class BadRequestErrorException extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode || 400;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = { BadRequestErrorException };