// // scripts/socket-server.js
// const { Server } = require("socket.io");
// const mongoose = require('mongoose');
// require('dotenv').config({ path: '.env.local' });

// const MONGO_URI = process.env.MONGO_URI;
// mongoose.connect(MONGO_URI).then(() => console.log("Socket server connected to MongoDB."));

// const ProductSchema = new mongoose.Schema({ stock: Number });
// const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// const io = new Server(4000, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

// console.log("Socket.IO server running on port 4000");

// io.on("connection", (socket) => {
//   console.log("Client connected:", socket.id);

//   socket.on("check-stock", async (productId) => {
//     try {
//       const product = await Product.findById(productId).select('stock');
//       const inStock = product && product.stock > 0;
//       socket.emit("stock-status", { productId, inStock });
//     } catch (error) {
//       console.error("Error checking stock:", error);
//       socket.emit("stock-status", { productId, inStock: false });
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });