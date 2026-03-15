import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "db/products.json");

type RawProduct = { id?: unknown; name?: unknown; price?: unknown };

function toProduct(p: RawProduct): Product {
  const id = Number(p.id);
  if (!Number.isInteger(id) || id < 1) {
    throw new Error("Invalid or missing product id in products file");
  }
  return new Product(
    id,
    String(p.name ?? ""),
    Number(p.price ?? 0),
  );
}

export class Product {
  constructor(
    public id: number,
    public name: string,
    public price: number,
  ) {}

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
    };
  }

  /** Returns the next unique id (max existing id + 1). Use when creating a new product. */
  static async getNextId(): Promise<number> {
    const products = await Product.findAll();
    if (products.length === 0) return 1;
    return Math.max(...products.map((p) => p.id)) + 1;
  }

  static async findAll(): Promise<Product[]> {
    try {
      const data = await fs.readFile(dbPath, "utf8");

      // If the file is empty, return an empty array
      if (!data.trim()) return [];

      // Parse the data as an unknown and check if it is an array
      const raw = JSON.parse(data) as unknown;

      // If the data is not an array, throw an error
      if (!Array.isArray(raw))
        throw new Error("Products file must contain a JSON array");

      // Map the data to products
      return raw.map((p) => toProduct(p as RawProduct));
    } catch (err: unknown) {
      const nodeErr = err as NodeJS.ErrnoException;

      // If the file does not exist, create it and return an empty array
      if (nodeErr?.code === "ENOENT") {
        await fs.mkdir(path.dirname(dbPath), { recursive: true });
        await fs.writeFile(dbPath, "[]");
        return [];
      }

      // If the data is not valid JSON, throw an error
      if (err instanceof SyntaxError)
        throw new Error("Invalid JSON in products file");

      // If the error is not a NodeJS.ErrnoException, throw the error
      throw err;
    }
  }

  async save(): Promise<void> {
    const products = await Product.findAll();
    products.push(this);
    await fs.writeFile(dbPath, JSON.stringify(products));
    console.log(`Product ${this.id} saved successfully`);
  }

  static async deleteById(id: number): Promise<boolean> {
    const products = await Product.findAll();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    await fs.writeFile(dbPath, JSON.stringify(products));
    return true;
  }
}
