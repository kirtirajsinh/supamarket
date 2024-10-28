"use client";
import React, { useState } from "react";
import type { Product } from "@/types/product";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageUrl } from "@/utils/const";
import Image from "next/image";

const ProductDisplay = ({ product }: { product: Product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = [product.coverImage, ...product.image];

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="space-y-2 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-3xl font-bold break-words">
            {product.name}
          </CardTitle>
          <span>
            <Badge className="text-sm sm:text-base">${product.price} Ξ</Badge>
          </span>
        </CardHeader>

        <CardContent className="p-2 sm:p-6">
          <Carousel
            setApi={(api) => {
              api?.on("select", () => {
                setCurrentImageIndex(api.selectedScrollSnap());
              });
            }}
            className="w-full max-w-xl mx-auto"
          >
            <CarouselContent>
              {allImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <div className="flex aspect-square items-center justify-center p-2 sm:p-6">
                      <Image
                        src={image ? `${ImageUrl}/${image}` : ""}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full rounded-lg object-contain"
                        width={500}
                        height={500}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>

          <div className="flex justify-center mt-2">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Image {currentImageIndex + 1} of {allImages.length}
            </p>
          </div>
        </CardContent>

        <CardContent className="p-2 sm:p-6">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description" className="text-sm sm:text-base">
                Description
              </TabsTrigger>
              <TabsTrigger value="details" className="text-sm sm:text-base">
                Details
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <ScrollArea className="h-[150px] sm:h-[200px] w-full rounded-md border p-2 sm:p-4">
                <p className="text-sm sm:text-base">{product.description}</p>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="details">
              <ScrollArea className="h-[150px] sm:h-[200px] w-full rounded-md border p-2 sm:p-4">
                <ul className="space-y-2 text-sm sm:text-base">
                  <li>
                    <strong>Created:</strong>{" "}
                    {product.createdAt.toLocaleDateString()}
                  </li>
                  <li>
                    <strong>Wallet Address:</strong>{" "}
                    <span className="break-all">{product.walletAddress}</span>
                  </li>
                </ul>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between p-4 sm:p-6">
          <Button
            className="w-full sm:w-auto text-sm sm:text-base"
            onClick={() => {
              window.open("https://warpcast.com", "_blank");
            }}
          >
            Share on Warpcast
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProductDisplay;
