const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        maxlength: 200,
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // allows null but enforces uniqueness when the field is not null
        trim: true,
        select: false,
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
    },
    verified: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ]
});

module.exports = mongoose.model('User', userSchema);
