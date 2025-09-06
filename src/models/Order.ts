import mongoose, { Schema } from 'mongoose';

// A sub-document schema for items within an order
const OrderItemSchema = new Schema({
    productId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    price: { // Price of the item at the time of purchase
        type: Number, 
        required: true 
    },
    thumbnail: { 
        type: String, 
        required: true 
    },
    customImage: { // For base64 custom print image
        type: String 
    },
}, { _id: false }); // No separate _id for order items

// The main order schema
const OrderSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [OrderItemSchema],
    totalAmount: { 
        type: Number, 
        required: true 
    },
    shippingAddress: { // A snapshot of the address, not a reference
        addressLine: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipcode: { type: String, required: true },
        country: { type: String, required: true },
    },
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Completed', 'Failed'], 
        default: 'Pending' 
    },
    orderStatus: { 
        type: String, 
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], 
        default: 'Pending' 
    },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;