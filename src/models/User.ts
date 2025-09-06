import mongoose, { Schema } from 'mongoose';

// A sub-document schema for shipping addresses
const AddressSchema = new Schema({
    addressLine: {
        type: String,
        required: [true, 'Address line is required.'],
    },
    city: {
        type: String,
        required: [true, 'City is required.'],
    },
    state: {
        type: String,
        required: [true, 'State is required.'],
    },
    zipcode: {
        type: String,
        required: [true, 'Zip code is required.'],
    },
    country: {
        type: String,
        required: [true, 'Country is required.'],
    },
});

// The main user schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required.'],
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
    },
    addresses: [AddressSchema], // Array of address sub-documents
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    // Fields for email verification
    verifyToken: String,
    verifyTokenExpiry: Date,
    // Fields for future password reset functionality
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Check if the model is already compiled and export it
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;