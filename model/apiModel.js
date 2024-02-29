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

    addRoute(path, method, requestExample, responseExample, expiresIn) {
        const routeKey = `${method.toUpperCase()} ${path}`;
        const validationSchema = this.generateValidationSchema(requestExample);

        this.dynamicRoutes[routeKey] = { requestExample, responseExample, validationSchema };

        if (expiresIn) {
            setTimeout(() => delete this.dynamicRoutes[routeKey], expiresIn * 1000);
        }

        return routeKey;
    }

    findRoute(method, path) {
        return this.dynamicRoutes[`${method} ${path}`];
    }

    validateRequest(route, data) {
        return route.validationSchema.validate(data);
    }
}

module.exports = ApiModel;
