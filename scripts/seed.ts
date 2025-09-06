import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '@/models/Product';

dotenv.config({ path: '.env.local' });

// Helper function to calculate average rating from reviews
const calculateAverageRating = (reviews: { rating: number }[] | undefined) => {
    if (!reviews || reviews.length === 0) {
        return 0;
    }
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((total / reviews.length).toFixed(2));
};

const productsData = [
    {
        title: "Classic Black Tee",
        description: "A timeless black t-shirt made from 100% premium cotton.",
        price: 999,
        discountPercentage: 10, // Included
        stock: 150, brand: "Glow Girl Basics", category: "t-shirts",
        thumbnail: "https://picsum.photos/500/700",
        images: ["https://picsum.photos/500/700", "https://picsum.photos/500/700"],
        isCustomizable: true,
        reviews: [{ rating: 5, comment: "Super soft!", reviewerName: "Priya" }, { rating: 4.5, comment: "Great fit.", reviewerName: "Rohan" }]
    },
    {
        title: "Minimalist White Hoodie",
        description: "Stay cozy and stylish with our soft-fleece white hoodie.",
        price: 2499,
        discountPercentage: 0, // Included
        stock: 80, brand: "Glow Girl Apparel", category: "hoodies",
        thumbnail: "https://picsum.photos/500/700",
        images: ["https://picsum.photos/500/700", "https://picsum.photos/500/700"],
        reviews: [{ rating: 5, comment: "So comfortable!", reviewerName: "Aisha" }]
        , isCustomizable: true,
    },
    {
        title: "Sunset Orange Graphic Tee",
        description: "A vibrant, pre-printed graphic tee that brings warmth and style.",
        price: 1299,
        discountPercentage: 15, // Included
        stock: 120, brand: "Glow Girl Apparel", category: "t-shirts",
        thumbnail: "https://picsum.photos/500/700",
        images: ["https://picsum.photos/500/700", "https://picsum.photos/500/700"],
        reviews: [{ rating: 5, comment: "So comfortable!", reviewerName: "Aisha" }]
        , isCustomizable: true,
    },
    {
        title: "Forest Green Crewneck",
        description: "A comfortable and stylish crewneck sweatshirt in a deep forest green.",
        price: 1999,
        discountPercentage: 0, // Included
        stock: 95, brand: "Glow Girl Basics", category: "sweatshirts",
        thumbnail: "https://picsum.photos/500/700",
        images: ["https://picsum.photos/500/700", "https://picsum.photos/500/700"],
        isCustomizable: true,
        reviews: [{ rating: 5, comment: "So comfortable!", reviewerName: "Aisha" }]

    },
    {
        title: "Pastel Pink Crop Top",
        description: "A trendy and soft pastel pink crop top, perfect for summer days.",
        price: 899,
        discountPercentage: 0, // Included
        stock: 200, brand: "Glow Girl Apparel", category: "t-shirts",
        thumbnail: "https://picsum.photos/500/700",
        images: ["https://picsum.photos/500/700", "https://picsum.photos/500/700"],

        isCustomizable: true,
        reviews: [{ rating: 4, comment: "Very cute!", reviewerName: "Sneha" }]
    },
    {
        title: "Charcoal Zip-Up Hoodie",
        description: "A versatile charcoal grey zip-up hoodie made with a cozy cotton blend.",
        price: 2799,
        discountPercentage: 5, // Included
        stock: 60, brand: "Glow Girl Basics", category: "hoodies",
        thumbnail: "https://picsum.photos/500/700",
        images: ["https://picsum.photos/500/700", "https://picsum.photos/500/700"],
        isCustomizable: true,
        reviews: [{ rating: 5, comment: "So comfortable!", reviewerName: "Aisha" }]

    },
    {
        title: "Navy Blue V-Neck Tee",
        description: "A classic navy blue v-neck that offers a flattering fit.",
        price: 1199,
        discountPercentage: 0, // Included
        stock: 180, brand: "Glow Girl Basics", category: "t-shirts",
        thumbnail: "https://picsum.photos/500/700",
        images: ["https://picsum.photos/500/700", "https://picsum.photos/500/700"],
        isCustomizable: true,
        reviews: [{ rating: 5, comment: "So comfortable!", reviewerName: "Aisha" }]

    },
    {
        title: "'Create' Graphic Sweatshirt",
        description: "Inspire your inner artist with our pre-printed 'Create' graphic sweatshirt.",
        price: 2199,
        discountPercentage: 0, // Included
        stock: 70, brand: "Glow Girl Apparel", category: "sweatshirts",
        thumbnail: "https://picsum.photos/500/700",
        images: ["https://picsum.photos/500/700", "https://picsum.photos/500/700"],
        isCustomizable: false,
        reviews: [{ rating: 5, comment: "Love the message!", reviewerName: "Karan" }]
    }
];

// Pre-process products to calculate average rating
const processedProducts = productsData.map(product => ({
    ...product,
    rating: calculateAverageRating(product.reviews),
}));

const seedDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI is not defined in .env.local");

    try {
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected for seeding.");
        await Product.deleteMany({});
        console.log("Existing products cleared.");
        await Product.insertMany(processedProducts); // Insert the processed data
        console.log("Database seeded successfully! 🌱");
    } catch (error) {
        console.error("Error during database seeding:", error);
    } finally {
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
    }
};

seedDB();
