import prisma from "../lib/prisma"

// Add a new product to the original catalog.
export const createProduct = async (data: { code: string; name: string; unit: string }) => {
  return await prisma.product.create({ data });
};

// Get the list of products so the client can display the Select/Autocomplete box.
export const getAllProducts = async () => {
  return await prisma.product.findMany({
    orderBy: { code: "asc" },
  });
};
