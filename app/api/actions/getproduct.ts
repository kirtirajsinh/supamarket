import { prisma } from "@/lib/prisma";

export const getProduct = async (
  productId: string,
  includeProductFile: boolean = false
) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: includeProductFile
      ? {
          productFiles: true,
        }
      : undefined,
  });
  return product;
};
