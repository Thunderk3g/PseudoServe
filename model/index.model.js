const apiModel = require('./apiModel');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.role = require("./roles.model");
db.ROLES = ["user", "admin"];

module.exports = {
    ApiModel: apiModel,
    db,
};
