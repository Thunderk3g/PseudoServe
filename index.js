const express = require('express');
<<<<<<< HEAD:PseudoServe-Backend/index.js
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const setupRoutes = require('./route/index.route'); // Adjusted to your file structure
const cors = require('cors');
const compression = require('compression');
const errorHandler = require('./middleware/errorHandler');

dotenv.config(); // This will load the environment variables from the .env file

const app = express();
const db = require("./model/index.model"); // Adjusted to your file structure
const Role = db.role;

app.use(express.json({ limit: '10mb' }));
app.use(compression());
app.use(express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
app.use(cors({ optionsSuccessStatus: 200 }));
=======
const bodyParser = require('body-parser');
const setupRoutes = require('./route/index.route'); // Import using index.route.js
const cors = require('cors'); // Import cors package


const app = express();
const port = 3000;
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
setupRoutes(app); // Setup routes using the index.route.js
>>>>>>> 58820c0847d09a893616b3843652b766f4b2a17d:index.js

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('MongoDB connected');
        initial();
    })
    .catch(err => console.error('MongoDB connection error:', err));

setupRoutes(app); // Setup routes using the provided index.route.js

app.use(errorHandler); // Use the custom error handler middleware

// Define the initial function to populate roles if they don't exist
async function initial() {
    try {
        const count = await Role.estimatedDocumentCount();
        if (count === 0) {
            await new Role({ name: "user" }).save();
            console.log("added 'user' to roles collection");

            await new Role({ name: "rider" }).save();
            console.log("added 'rider' to roles collection");

            await new Role({ name: "admin" }).save();
            console.log("added 'admin' to roles collection");
        }
    } catch (err) {
        console.error("error initializing roles:", err);
    }
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
