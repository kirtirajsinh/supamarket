import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "./prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkOrderPresent = async (productId: string, fid: number) => {
  const order = await prisma.order.findFirst({
    where: {
      productId: productId,
      fid: fid,
    },
  });
  return order;
};

export const createOrder = async (
  productId: string,
  pricePaidInCents: number,
  fid: number
) => {
  const createOrder = await prisma.order.create({
    data: {
      productId: productId,
      pricePaidInCents: pricePaidInCents,
      fid: fid,
      isPaid: true,
    },
  });
  return createOrder;
};
