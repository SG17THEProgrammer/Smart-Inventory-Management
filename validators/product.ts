import { z } from "zod";

export const productSchema = z.object({
  name: z
      .string()
      .min(3, "Name must be at least 3 characters"),
  sku: z.string().min(1, "SKU is required"),
  price: z.number().positive("Price must be a positive number"),
  stock: z.number().nonnegative("Stock must be a non-negative number"),
});