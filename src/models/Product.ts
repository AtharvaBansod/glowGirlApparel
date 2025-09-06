import mongoose, { Schema } from 'mongoose';

// A sub-document schema for product reviews
const ReviewSchema = new Schema({
    rating: { 
        type: Number, 
        required: true,
        min: 1,
        max: 5
    },
    comment: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    reviewerName: { 
        type: String, 
        required: true 
    },
});

// The main product schema
const ProductSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    discountPercentage: { 
        type: Number, 
        default: 0 
    },
    rating: { // This will store the calculated average rating
        type: Number, 
        default: 0 
    },
    stock: { 
        type: Number, 
        required: true 
    },
    brand: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true, 
        index: true // Indexing for faster queries by category
    },
    thumbnail: { 
        type: String, 
        required: true 
    },
    images: [{ 
        type: String 
    }],
    reviews: [ReviewSchema],
    isCustomizable: { // Flag for the custom print feature
        type: Boolean, 
        default: false 
    },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Mongoose middleware to run before a 'save' operation
ProductSchema.pre('save', function(next) {
    // 'this' refers to the document being saved
    if (this.isModified('reviews') || this.isNew) {
        if (this.reviews && this.reviews.length > 0) {
            const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
            this.rating = parseFloat((totalRating / this.reviews.length).toFixed(2));
        } else {
            this.rating = 0;
        }
    }
    next(); // Continue with the save operation
});


const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;