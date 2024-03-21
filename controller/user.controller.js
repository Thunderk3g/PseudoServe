const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user/user.model');
const asyncHandler = require('../../middlewares/asyncHandler');
const CustomError = require('../../utils/CustomError');
const db = require("../../models/index.model");
const Role = db.role;
// Environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Register user
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password, phoneNumber, roles, createdAt, updatedAt } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
        throw new CustomError(400, 'Email or phone number already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, phoneNumber, verified: false, createdAt, updatedAt });

    if (roles) {
        const assignedRoles = await Role.find({ name: { $in: roles } });
        user.roles = assignedRoles.map(role => role._id);
    } else {
        const defaultRole = await Role.findOne({ name: 'user' });
        user.roles = [defaultRole._id];
    }

    await user.save();

    res.status(201).send({ message: 'User was registered successfully!' });
});

// Login user
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) {
        throw new CustomError(401, 'Invalid email or password');
    } else {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const { accessToken, expiresIn } = generateAccessToken(user.phoneNumber);
            res.status(200).json({ message: 'Login successful', accessToken, expiresIn });
        } else {
            throw new CustomError(401, 'Invalid email or password');
        }
    }
});

// Generate Access Token
function generateAccessToken(phoneNumber) {
    const payload = { phoneNumber };
    const expiresIn = '1h';
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn });
    const expirationTimestamp = Math.floor(Date.now() / 1000) + jwt.decode(accessToken).exp;
    return { accessToken, expiresIn: expirationTimestamp };
}

// Logout and Update Profile (to be implemented)
