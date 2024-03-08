const fs = require('fs');
const Joi = require('joi');

class PostmanModel {
    constructor(app) {
        this.app = app; // Express app instance
        this.dynamicRoutes = {};
    }

    parseCollection(filePath) {
        const rawData = fs.readFileSync(filePath, 'utf8');
        const collection = JSON.parse(rawData);
        collection.item.forEach((item) => {
            this.setupEndpoint(item);
        });
    }

    setupEndpoint(item) {
        const { name, request } = item;
        let path, method = request.method.toLowerCase(); // Ensure method is lowercase
        let requestExample = {};
        let responseExample = {};
    
        try {
            const parsedBody = JSON.parse(request.body.raw);
            if (parsedBody.path && parsedBody.method) {
                path = parsedBody.path;
                method = parsedBody.method.toLowerCase();
                requestExample = parsedBody.requestExample || {};
                responseExample = parsedBody.responseExample || {};
            } else {
                path = `/api/${this.normalizeNameAsPath(name)}`;
                requestExample = parsedBody;
                // Set a generic response if not defined
                responseExample = { message: "This is a generic response." };
            }
        } catch (error) {
            console.error('Error parsing request body:', error.message);
            return; // Exit if parsing fails
        }
    
        const validationSchema = this.generateValidationSchema(requestExample);
        const routeKey = `${method.toUpperCase()} ${path}`;
    
        this.dynamicRoutes[routeKey] = { requestExample, responseExample, validationSchema };
        console.log (this.dynamicRoutes);
        // Register dynamic route with Express
        this.app[method](path, (req, res) => {
            console.log(`Request path: ${req.path}`);
            console.log(`Request method: ${req.method}`);
            console.log(`Request headers: ${JSON.stringify(req.headers)}`);
            console.log(`Request body: ${JSON.stringify(req.body)}`);
    
            // Match the request to a dynamic route and validate
            const matchingRoute = this.dynamicRoutes[`${req.method.toUpperCase()} ${req.path}`];
            if (matchingRoute) {
                const { error } = matchingRoute.validationSchema.validate(req.body);
                if (error) {
                    return res.status(400).send(error.details[0].message);
                }
                console.log(`Response: ${JSON.stringify(matchingRoute.responseExample)}`);
                res.json(matchingRoute.responseExample);
            } else {
                res.status(404).send('Not found');
            }
        });
    
        console.log(`Dynamic route setup: ${method.toUpperCase()} ${path}`);
    }
    findRoute(method, path) {
        console.log(method , path);
        console.log(this.dynamicRoutes)
        return this.dynamicRoutes[`${method} ${path}`];
    }

    generateValidationSchema(requestExample) {
        let schema = Joi.object();
        Object.keys(requestExample).forEach(key => {
            schema = schema.append({ [key]: Joi.any().required() });
        });
        return schema;
    }

    normalizeNameAsPath(name) {
        return name.toLowerCase().replace(/\s+/g, '-');
    }
    validateRequest(route, data) {
        return route.validationSchema.validate(data);
    }
}

module.exports = PostmanModel;
