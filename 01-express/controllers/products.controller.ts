import { Request, Response } from "express";
import { Product } from "../models/product.js";

export async function getProducts(_req: Request, res: Response): Promise<void> {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load products" });
  }
}

export async function createProduct(
  req: Request,
  res: Response,
): Promise<void> {
  const { name, price } = req.body;

  if (name == null || typeof name !== "string" || !name.trim()) {
    res
      .status(400)
      .json({ message: "Name is required and must be a non-empty string" });
    return;
  }
  const priceNum = Number(price);
  if (price == null || Number.isNaN(priceNum) || priceNum < 0) {
    res
      .status(400)
      .json({ message: "Price is required and must be a non-negative number" });
    return;
  }

  try {
    const id = await Product.getNextId();
    const product = new Product(id, name.trim(), priceNum);
    await product.save();
    res.status(201).json(product.toJSON());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save product" });
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
): Promise<void> {
  const param = Array.isArray(req.params.id)
    ? (req.params.id[0] ?? "")
    : (req.params.id ?? "");
  const id = Number(param);

  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid product ID" });
    return;
  }

  try {
    const deleted = await Product.deleteById(id);
    if (!deleted) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Product deleted successfully", productId: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete product" });
  }
}
