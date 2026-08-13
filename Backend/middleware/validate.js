const ApiError = require("../utils/ApiError")

const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query
        });

        if (!result.success) {
            const message = result.error.issues
                .map((issue) => issue.message)
                .join(", ");

            return next(
                new ApiError(
                    400,
                    message
                )
            );
        }

        req.body = result.data.body;
        req.params = result.data.params;
        req.query = result.data.query;

        next();
    };
};

module.exports = validate;