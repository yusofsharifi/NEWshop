import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handlePlaceholder } from "./routes/placeholder";
import { initializeDatabase, seedDatabase } from "./database/init";
import {
  getProducts,
  getProduct,
  getCategories,
  getCategory,
  createProduct,
  updateProduct,
  deleteProduct
} from "./routes/products";

export function createServer() {
  const app = express();

  // Initialize database
  initializeDatabase()
    .then(() => seedDatabase())
    .then(() => console.log('Database initialized successfully'))
    .catch(err => console.error('Database initialization failed:', err));

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Placeholder image routes
  app.get("/api/placeholder/:width/:height", handlePlaceholder);

  // Product API routes
  app.get("/api/products", getProducts);
  app.get("/api/products/:id", getProduct);
  app.get("/api/categories", getCategories);
  app.get("/api/categories/:slug", getCategory);

  // Admin product routes (should be protected in production)
  app.post("/api/admin/products", createProduct);
  app.put("/api/admin/products/:id", updateProduct);
  app.delete("/api/admin/products/:id", deleteProduct);

  return app;
}
