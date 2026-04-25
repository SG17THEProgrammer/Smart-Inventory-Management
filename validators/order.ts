import { z } from "zod";

export const orderSchema = z.object({
  productId: z
    .string()
    .min(1, "Product ID is required"),

 quantity: z.preprocess(
  (val) => Number(val),
  z.number()
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than 0")
),

});