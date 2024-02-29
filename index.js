const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const dynamicRoutes = {};

// Function to generate a Joi validation schema from the requestExample
function generateValidationSchema(requestExample) {
    let schema = Joi.object();
    for (let key in requestExample) {
        // Example: Add more specific validation based on actual data types and requirements
        schema = schema.append({ [key]: Joi.required() });
    }
    return schema;
}

app.post('/create-temp-api', (req, res) => {
    const { path, method, requestExample, responseExample, expiresIn } = req.body;

    const routeKey = `${method.toUpperCase()} ${path}`;
    const validationSchema = generateValidationSchema(requestExample);

    dynamicRoutes[routeKey] = { requestExample, responseExample, validationSchema };

    if (expiresIn) {
        setTimeout(() => delete dynamicRoutes[routeKey], expiresIn * 1000);
    }

    app[method.toLowerCase()](path, (req, res) => {
        const matchingRoute = dynamicRoutes[`${req.method} ${req.path}`];
        if (matchingRoute) {
            // Perform validation based on the method (query params for GET, body for POST, etc.)
            const validationTarget = req.method === 'GET' ? req.query : req.body;
            const { error } = matchingRoute.validationSchema.validate(validationTarget);
            if (error) {
                return res.status(400).send(error.details[0].message);
            }
            res.json(matchingRoute.responseExample);
        } else {
            res.status(404).send('Not found');
        }
    });

    res.send(`Temporary API created at ${path} with method ${method}. Expires in ${expiresIn || 'never'}`);
});

app.listen(port, () => {
    console.log(`PseudoServe listening at http://localhost:${port}`);
});
