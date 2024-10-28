import React from "react";
import Link from "next/link";
import ConnectButtonComponent from "../auth/ConnectButtonComponent";

const NavBar = () => {
  return (
    <div className="z-50 fixed top-0 sm:top-4 md:top-8 left-1/2 transform -translate-x-1/2 flex w-full sm:w-11/12 md:w-8/12 lg:w-2/5 justify-between items-center">
      <div className="w-full flex justify-between items-center px-4 sm:px-6 md:px-8 py-3 backdrop-blur-xl border border-blue-500/10 backdrop-filter bg-blue-900/10 sm:rounded-full">
        <Link
          href="/"
          className="text-xl sm:text-2xl font-bold whitespace-nowrap"
        >
          supamarket
        </Link>
        <div className="flex items-center">
          <ConnectButtonComponent />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
