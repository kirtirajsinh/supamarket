import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductSkeleton = () => {
  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-9 w-2/3" />
          </CardTitle>
          <Skeleton className="h-5 w-20" />
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-xl mx-auto">
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>
          <div className="flex justify-center mt-2">
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
        <CardContent>
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <div className="h-[200px] w-full rounded-md border p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProductSkeleton;
