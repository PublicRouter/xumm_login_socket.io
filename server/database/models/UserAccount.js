const { Schema, model, models } = require("mongoose");

const UserAccountSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    wallet: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    about: {
        type: String,
        trim: true,
        default: ''
    },
    profilePic: {
        type: String, // assuming this is a URL or file path
        default: ''
    }
}, {
    timestamps: true,
});

export const Product = models.UserAccount || model('Product', UserAccountSchema);