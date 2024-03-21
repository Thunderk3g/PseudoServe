const apiRoutes = require('./apiRoute');
const userRoutes = require('./userRoute')
module.exports = function (app) {

    app.use('/api', apiRoutes);
    app.use('/user', userRoutes);
};
