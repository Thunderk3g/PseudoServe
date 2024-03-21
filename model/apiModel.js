const Joi = require('joi');
class ApiModel {
    constructor() {
        this.dynamicRoutes = {};
    }

    generateValidationSchema(requestExample) {
        let schema = Joi.object();
        for (let key in requestExample) {
            schema = schema.append({ [key]: Joi.required() });
        }
        return schema;
    }

    // Updated to include header validation
    addRoute(path, method, requestExample, responseExample, expiresIn, headers = {}) {
        const routeKey = `${method.toUpperCase()} ${path}`;
        // For headers, we'll use express-validator in the controller, so just store them here
        this.dynamicRoutes[routeKey] = {
            requestExample,
            responseExample,
            expiresIn,
            validationSchema: this.generateValidationSchema(requestExample)
        };

        if (expiresIn) {
            setTimeout(() => delete this.dynamicRoutes[routeKey], expiresIn * 1000);
        }
    }

    findRoute(method, path) {
        return this.dynamicRoutes[`${method.toUpperCase()} ${path}`];
    }

    validateRequest(route, data) {
        return route.validationSchema.validate(data);
    }
}

module.exports = ApiModel;
