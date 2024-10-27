import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(3)].map((_, index) => (
          <Card
            key={index}
            className="flex flex-col h-full transition-all duration-300"
          >
            <CardHeader className="p-0">
              <Skeleton className="w-full h-[200px]" />
            </CardHeader>
            <CardContent className="flex-grow p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="p-4 flex justify-between items-center">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Loading;
