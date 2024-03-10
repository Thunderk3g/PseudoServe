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

        const processItem = (currentItem) => {
            // Extract name and request from the current item
            const { name, request } = currentItem;
            let path, method;
            let requestExample = {};
            let responseExample = {};

            if (request && request.method) {
                // Ensure method is lowercase
                method = request.method.toLowerCase();
            }

            try {
                if (request && request.body && request.body.raw) {
                    // Parse request body if available
                    const parsedBody = JSON.parse(request.body.raw);
                    if (parsedBody.path && parsedBody.method) {
                        // If path and method are specified in the body, use them
                        path = parsedBody.path;
                        method = parsedBody.method.toLowerCase();
                        requestExample = parsedBody.requestExample || {};
                        responseExample = parsedBody.responseExample || {};
                    } else {
                        // Use default path and response if not specified
                        path = `/api/${this.normalizeNameAsPath(name)}`;
                        requestExample = parsedBody;
                        responseExample = { message: "This is a generic response." };
                    }
                }
            } catch (error) {
                console.error('Error parsing request body:', error.message);
                return; // Exit if parsing fails
            }

            if (method && path) {
                // Generate validation schema based on the request example
                const validationSchema = this.generateValidationSchema(requestExample);
                const routeKey = `${method.toUpperCase()} ${path}`;

                // Store the dynamic route configuration
                this.dynamicRoutes[routeKey] = { requestExample, responseExample, validationSchema };
                console.log(this.dynamicRoutes)
                // Register the dynamic route with Express
                this.app[method](path, (req, res) => {
                    // Logging request details    

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
        };

        // Check if the current item has nested items
        if (Array.isArray(item.item)) {
            // If so, recursively process each nested item
            item.item.forEach(nestedItem => this.setupEndpoint(nestedItem));
        } else {
            // Otherwise, process the item directly
            processItem(item);
        }
    }


    findRoute(method, path) {
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
