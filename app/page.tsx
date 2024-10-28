import HeroSection from "@/components/landing/HeroSection";

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-white min-h-screen">
      <main className="flex flex-col items-center justify-center w-full px-4 py-8 text-center">
        {/* Responsive heading with smaller text on mobile */}
        <h1 className="text-4xl md:text-8xl font-extrabold mb-8 bg-gradient-to-r from-[#472A91] to-[#9E9696] text-transparent bg-clip-text">
          Sell Your Products <span className="block">in Frame</span>
        </h1>

        {/* Responsive card that scales well on mobile */}
        <div className="relative bg-purple-300 p-4 md:p-6 rounded-lg shadow-md w-full max-w-[288px] aspect-[1.3] mb-8">
          <div className="grid grid-cols-3 gap-2 md:gap-4 h-full">
            {/* Responsive grid items */}
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`rounded-full w-8 h-8 md:w-12 md:h-12 ${
                  i % 3 === 0
                    ? "bg-teal-300"
                    : i % 2 === 0
                    ? "bg-purple-400"
                    : "bg-white"
                }`}
              />
            ))}
          </div>

          {/* Responsive bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-3 md:px-4 py-2 bg-gray-100 rounded-b-lg">
            <p className="text-sm md:text-base text-gray-600 font-semibold">
              0.005 Ξ
            </p>
            <button className="text-sm md:text-base bg-gray-300 text-gray-700 py-1 px-3 md:px-4 rounded-lg">
              Redeem
            </button>
          </div>
        </div>

        <HeroSection />
      </main>
    </div>
    // </div>
  );
}
