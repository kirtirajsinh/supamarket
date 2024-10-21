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
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{product.name}</CardTitle>
          <span>
            <Badge>${product.price} Ξ</Badge>
          </span>
        </CardHeader>
        <CardContent>
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
                    <div className="flex aspect-square items-center justify-center p-6">
                      <Image
                        src={image ? `${ImageUrl}/${image}` : ""}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full  rounded-lg object-contain"
                        width={500}
                        height={500}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="flex justify-center mt-2">
            <p className="text-sm text-muted-foreground">
              Image {currentImageIndex + 1} of {allImages.length}
            </p>
          </div>
        </CardContent>
        <CardContent>
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <p>{product.description}</p>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="details">
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <ul className="space-y-2">
                  <li>
                    <strong>Created:</strong>{" "}
                    {product.createdAt.toLocaleDateString()}
                  </li>
                  <li>
                    <strong>User ID:</strong> {product.userId}
                  </li>
                  <li>
                    <strong>Wallet Address:</strong> {product.walletAddress}
                  </li>
                </ul>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
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
