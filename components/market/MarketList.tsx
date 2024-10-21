"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ImageUrl } from "@/utils/const";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string[];
  coverImage: string;
  description: string;
  isAvailableForPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
  walletAddress: string;
  productFiles?: {
    fileKey: string;
    fileName?: string | null;
  }[];
}

interface ProductListProps {
  products: Product[];
}

const MarketList: React.FC<ProductListProps> = ({ products }) => {
  return (
    // <div>
    //   {products.map((product: Product) => (
    //     <div key={product.id}>
    //       <h2>{product.name}</h2>
    //       <p>{product.description}</p>
    //       <p>{product.price}</p>
    //       {product.image && (
    //         <Link href={`/market/${product.id}`}>
    //           <Image
    //             src={`${ImageUrl}/${product.coverImage}` || "/placeholder.png"}
    //             alt={product.name}
    //             width={500}
    //             height={500}
    //           />
    //         </Link>
    //       )}
    //     </div>
    //   ))}
    // </div>

    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            href={`/market/${product.id}`}
            key={product.id}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="aspect-[3/4] relative">
                <Image
                  src={
                    `${ImageUrl}/${product.coverImage}` ||
                    "/placeholder.svg?height=600&width=450"
                  }
                  alt={product.name}
                  layout="fill"
                  objectFit="contain" // Change to "contain" to make the image fit fully
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2 line-clamp-1">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    {product.price ? `$${product.price} Ξ` : "Free"}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    View Details
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default MarketList;
