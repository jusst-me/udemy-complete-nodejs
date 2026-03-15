import express from "express";
import * as productsController from "../controllers/products.controller.js";

const router = express.Router();

router.get("/", productsController.getProducts);
router.post("/", productsController.createProduct);
router.delete("/:id", productsController.deleteProduct);

export default router;
