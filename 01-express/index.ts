import express from "express";

import shopRoutes from "./routes/products.routes.js";
import adminRoutes from "./routes/admin.routes.js";

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Support URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

// First example of a middleware
app.use((_, __, next) => {
  console.log("[Middleware 1] Request received");
  next();
});

// Second example of a middleware
app.use((_, __, next) => {
  console.log("[Middleware 2] Request received");
  next();
});

// Simple GET endpoint
app.get("/", (_, res) => {
  res.send("[GET /] Hello World");
});

// Product routes
app.use("/products", shopRoutes);

// Admin routes
app.use("/admin", adminRoutes);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
