"use client"; // This ensures the component is treated as a client-side component

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  return (
    <div className="flex space-x-4">
      <Button
        size="lg"
        className="bg-purple-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-purple-600 transition duration-300"
        onClick={() => router.push("/sell")}
      >
        Sell Product
      </Button>
      <Button
        size="lg"
        className="bg-purple-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-purple-600 transition duration-300"
        onClick={() => router.push("/market")}
      >
        Explore
      </Button>
    </div>
  );
}
