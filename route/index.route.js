const apiRoutes = require('./apiRoute');

module.exports = function (app) {

    app.use('/api', apiRoutes);
    // Mount other route groups here
};
