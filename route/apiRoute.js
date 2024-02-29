const express = require('express');
const router = express.Router();
const apiController = require('../controller/apiController');

router.post('/create-temp-api', apiController.createTempApi);

// Dynamic route handler
router.all('*', apiController.handleTempApiRequest);

module.exports = router;
