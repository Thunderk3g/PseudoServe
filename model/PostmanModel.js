const fs = require('fs');
const Joi = require('joi');
const express = require('express');

class PostmanModel {
    constructor(app) {
        this.app = app; // Express app instance
        this.dynamicRoutes = {}; // Store dynamic routes similar to ApiModel
    }

    // Method to read and parse the Postman collection file
    parseCollection(filePath) {
        const rawData = fs.readFileSync(filePath, 'utf8');
        const collection = JSON.parse(rawData);
        collection.item.forEach((item) => {
            this.setupEndpoint(item);
        });
    }

    // Method to setup an endpoint from a Postman collection item
    setupEndpoint(item) {
        // // console.log(item);
        const { name, request, response } = item;
        const path = `/api/${this.normalizeNameAsPath(name)}`; // Convert name to URL path
        const method = request.method;
        // const tempResp = this.normalizeNameAsPath(request.body.raw)
        // console.log(tempResp)
        const responseExample = response ? (response) : {}; // Assuming 'raw' format for simplicity
        // console.log(responseExample);
        // Generate a Joi schema for validation if needed (simplified example)
        console.log(this.normalizeNameAsPath(request.body.raw))
        const requestExample = request.body ? (this.normalizeNameAsPath(request.body.raw)) : {}; // Define how to extract this based on your requirements
        const validationSchema = this.generateValidationSchema(requestExample);

        // Similar to addRoute in ApiModel
        const routeKey = `${method.toUpperCase()} ${path}`;
        this.dynamicRoutes[routeKey] = { requestExample, responseExample, validationSchema };
        // Setup Express route
        if (['GET', 'POST', 'PUT', 'DELETE'].includes(method)) {
            (req, res) => {
                // Validate request
                const validationTarget = req.method === 'GET' ? req.query : req.body;
                const { error } = validationSchema.validate(validationTarget);
                if (error) {
                    return res.status(400).send(error.details[0].message);
                }
                // Send response
                console.log(responseExample);
                res.json(responseExample);
            };
            console.log(`Setup endpoint: ${method.toUpperCase()} ${path}`);
        }
    }

    // Utility method to generate a Joi validation schema from a request example
    generateValidationSchema(requestExample) {
        let schema = Joi.object();
        for (let key in requestExample) {
            schema = schema.append({ [key]: Joi.any().required() }); // Simplified validation
        }
        return schema;
    }

    // Utility method to normalize a name as a URL path
    normalizeNameAsPath(name) {
        return name.toLowerCase().replace(/\s+/g, '');
    }

    // Add other necessary methods from ApiModel if needed
}

module.exports = PostmanModel;
