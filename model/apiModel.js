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

    // Extend addRoute to include optional headers
    addRoute(path, method, requestExample, responseExample, expiresIn, headers = {}) {
        const routeKey = `${method.toUpperCase()} ${path}`;
        const validationSchema = this.generateValidationSchema(requestExample);

        // Store headers along with other route information
        this.dynamicRoutes[routeKey] = { requestExample, responseExample, validationSchema, headers };

        if (expiresIn) {
            setTimeout(() => delete this.dynamicRoutes[routeKey], expiresIn * 1000);
        }

        return routeKey;
    }

    // Modify findRoute to consider headers if they are provided
    findRoute(method, path, incomingHeaders = {}) {
        const route = this.dynamicRoutes[`${method.toUpperCase()} ${path}`];
        if (!route) return null;

        // If route has headers defined, match them with incoming headers
        if (route.headers && Object.keys(route.headers).length > 0) {
            const headersMatch = Object.entries(route.headers).every(([key, value]) => incomingHeaders[key] === value);
            if (!headersMatch) return null;
        }

        return route;
    }

    validateRequest(route, data) {
        return route.validationSchema.validate(data);
    }
}

module.exports = ApiModel;
