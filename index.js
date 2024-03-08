const express = require('express');
const bodyParser = require('body-parser');
const setupRoutes = require('./route/index.route'); // Import using index.route.js
const cors = require('cors'); // Import cors package


const app = express();
const port = 3000;
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
setupRoutes(app); // Setup routes using the index.route.js

app.listen(port, () => {
    console.log(`PseudoServe listening at http://localhost:${port}`);
});
