import ConnectButtonComponent from "@/components/auth/ConnectButtonComponent";
import HeroSection from "@/components/landing/HeroSection";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt");

  return (
    // <div className="flex min-h-screen flex-col text-primary-text">
    <div className=" flex flex-col items-center justify-center bg-white">
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center w-full px-4 py-8 text-center">
        <h1 className="text-8xl font-extrabold  mb-8 bg-gradient-to-r from-[#472A91] to-[#9E9696] text-transparent bg-clip-text">
          Sell Your Products <span className="block">in Frame</span>
        </h1>

        <div className="relative bg-purple-300 p-6 rounded-lg shadow-md w-72 h-56 flex items-center justify-center mb-8">
          {/* CandyGrid Image */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-teal-300 rounded-full w-12 h-12"></div>
            <div className="bg-purple-400 rounded-full w-12 h-12"></div>
            <div className="bg-white rounded-full w-12 h-12"></div>
            <div className="bg-purple-400 rounded-full w-12 h-12"></div>
            <div className="bg-teal-300 rounded-full w-12 h-12"></div>
            <div className="bg-white rounded-full w-12 h-12"></div>
            <div className="bg-white rounded-full w-12 h-12"></div>
            <div className="bg-purple-400 rounded-full w-12 h-12"></div>
            <div className="bg-teal-300 rounded-full w-12 h-12"></div>
          </div>

          {/* Pricing and Redeem buttons */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-4 py-2 bg-gray-100 rounded-b-lg">
            <p className="text-gray-600 font-semibold">0.005 Ξ</p>
            <button className="bg-gray-300 text-gray-700 py-1 px-4 rounded-lg">
              Redeem
            </button>
          </div>
        </div>

        {/* Get Started Button */}
        {jwt ? <HeroSection /> : <ConnectButtonComponent />}
      </main>
    </div>
    // </div>
  );
}
