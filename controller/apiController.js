const ApiModel = require('../model/apiModel');
const PostmanModel = require('../model/PostmanModel')
const apiModel = new ApiModel();

exports.createTempApi = (req, res) => {
    const { path, method, requestExample, responseExample, expiresIn } = req.body;

    const routeKey = apiModel.addRoute(path, method, requestExample, responseExample, expiresIn);

    res.send(`Temporary API created at ${path} with method ${method}. Expires in ${expiresIn || 'never'}`);
};

exports.handleTempApiRequest = (req, res) => {
    const matchingRoute = apiModel.findRoute(req.method, req.path);

    if (matchingRoute) {
        const validationTarget = req.method === 'GET' ? req.query : req.body;
        const { error } = apiModel.validateRequest(matchingRoute, validationTarget);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        res.json(matchingRoute.responseExample);
    } else {
        res.status(404).send('Not found');
    }
};
exports.importPostmanCollection = (req, res) => {
    const postmanModel = new PostmanModel(req.app.locals.dynamicRoutes);
    postmanModel.parseCollection(req.file.path);
    res.send('Imported Postman collection and created APIs');
};