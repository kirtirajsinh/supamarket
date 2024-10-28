"use client"; // This ensures the component is treated as a client-side component

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import ConnectButtonComponent from "../auth/ConnectButtonComponent";

export default function HeroSection() {
  const router = useRouter();
  const activeAccount = useActiveAccount();

  return (
    <>
      {activeAccount ? (
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 w-full px-4 sm:px-0 sm:w-auto">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-purple-700 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg hover:bg-purple-600 transition duration-300"
            onClick={() => router.push("/sell")}
          >
            Sell Product
          </Button>
          <Button
            size="lg"
            className="w-full sm:w-auto bg-purple-700 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg hover:bg-purple-600 transition duration-300"
            onClick={() => router.push("/market")}
          >
            Explore
          </Button>
        </div>
      ) : (
        <div className="w-full px-4 sm:px-0 sm:w-auto">
          <ConnectButtonComponent />
        </div>
      )}
    </>
  );
}
