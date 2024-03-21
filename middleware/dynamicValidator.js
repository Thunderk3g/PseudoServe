// In a new file, create a dynamic validation middleware
const Joi = require('joi');

function validateRequest(req, res, next) {
    const route = apiModel.findRoute(req.method, req.path);
    if (!route) {
        return next(); // No route found, proceed to the next middleware (possibly a 404 handler)
    }

    const { validationSchema } = route;
    const validationResult = validationSchema.validate(req.body);
    if (validationResult.error) {
        return res.status(400).send(validationResult.error.details[0].message);
    }

    // Optional: Validate headers if defined in the route
    if (route.headers) {
        const headersValidationResult = Joi.object(route.headers).validate(req.headers);
        if (headersValidationResult.error) {
            return res.status(400).send(headersValidationResult.error.details[0].message);
        }
    }

    next(); // Validation passed
}
