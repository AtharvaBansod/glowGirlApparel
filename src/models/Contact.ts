import mongoose, { Schema } from 'mongoose';

const ContactSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    queryType: { 
        type: String, 
        enum: ['General', 'Order Related'], 
        required: true 
    },
    orderId: { // Optional, only for order-related queries
        type: String 
    },
    message: { 
        type: String, 
        required: true 
    },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

export default Contact;