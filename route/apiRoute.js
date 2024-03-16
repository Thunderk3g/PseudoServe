const express = require('express');
const router = express.Router();
const apiController = require('../controller/apiController'); // Update path as necessary

// Middleware for file uploads
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Route for creating temporary APIs directly
router.post('/create-temp-api', apiController.createTempApi);

// Route for importing Postman collection to create temporary APIs
router.post('/import', upload.single('collection'), apiController.importPostmanCollection);

// Dynamic route handler for all other requests
router.all('*', apiController.handleTempApiRequest);

module.exports = router;
