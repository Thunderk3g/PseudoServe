const express = require('express');
const app = express();
const ApiModel = require('../model/apiModel');
const PostmanModel = require('../model/PostmanModel')
const apiModel = new ApiModel();
const postmanModel = new PostmanModel(app);
exports.createTempApi = (req, res) => {
    const { path, method, requestExample, responseExample, expiresIn } = req.body;

    const routeKey = apiModel.addRoute(path, method, requestExample, responseExample, expiresIn);

    res.send(`Temporary API created at ${path} with method ${method}. Expires in ${expiresIn || 'never'}`);
};

exports.handleTempApiRequest = (req, res) => {
    var matchingRoute = apiModel.findRoute(req.method, req.path);

    // Direct header validation example
    if (matchingRoute) {
        const isValidHeaders = Object.entries(matchingRoute.headers).every(([key, value]) => req.headers[key] === value);
        if (!isValidHeaders) {
            return res.status(400).send("Headers do not match the expected criteria.");
        }
    }
    else {
        matchingRoute = postmanModel.findRoute(req.method, req.path);
        if (matchingRoute) {
            // Assuming PostmanModel also implements validateRequest or similar validation logic
            const { error } = postmanModel.validateRequest(matchingRoute, req.body);
            if (error) {
                return res.status(400).send(error.details[0].message);
            }
            return res.json(matchingRoute.responseExample);
        }
    }
};
exports.importPostmanCollection = (req, res) => {
    postmanModel.parseCollection(req.file.path);
    res.send('Imported Postman collection and created APIs');
};