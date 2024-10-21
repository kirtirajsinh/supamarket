import MarketList from "@/components/market/MarketList";
import { prisma } from "@/lib/prisma";
import React from "react";

const getProducts = async () => {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log(products);
  return products;
};

const market = async () => {
  const products = await getProducts();
  return (
    <div>
      <MarketList products={products} />
    </div>
  );
};

export default market;
