"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ImageUrl } from "@/utils/const";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowRight } from "lucide-react";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            href={`/market/${product.id}`}
            key={product.id}
            className="group h-full"
          >
            <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="p-0">
                <div className="w-full md:max-w-[354px] md:max-h-[200px]">
                  <Image
                    src={
                      `${ImageUrl}/${product.coverImage}` ||
                      "/placeholder.svg?height=600&width=450"
                    }
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    width={354}
                    height={185}
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-4">
                <h2 className="text-lg font-semibold mb-2 line-clamp-1">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
              </CardContent>
              <CardFooter className="p-4 flex justify-between items-center">
                <Badge
                  variant={product.price ? "default" : "secondary"}
                  className="text-xs font-medium"
                >
                  {product.price ? `${product.price} Ξ` : "Free"}
                </Badge>
                <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:underline">
                  View Details
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default MarketList;
