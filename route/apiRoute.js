const express = require('express');
const router = express.Router();
const apiController = require('../controller/apiController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
router.post('/create-temp-api', apiController.createTempApi);
router.post('/import', upload.single('collection'), apiController.importPostmanCollection);
// Dynamic route handler
router.all('*', apiController.handleTempApiRequest);

module.exports = router;
