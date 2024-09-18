const { HttpError } = require("../helpers");

const validateBody = (schema) => {
    const func = async (req, res, next) => {
        const { error } = schema.validate(req.body); 

        if (error) {
            const errorMessages = error.details.map(item => item.message).join(', ');
            next(HttpError(400, errorMessages));
        } else {
            next();
        }
    };

    return func;
};

module.exports = {
    validateBody
};
