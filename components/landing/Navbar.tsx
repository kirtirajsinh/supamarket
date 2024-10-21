import React from "react";
import LoginButton from "../auth/LoginButton";

const NavBar = () => {
  return (
    <div className="z-50  fixed top-8 left-1/2 transform -translate-x-1/2 inline-flex mx-auto justify-between w-8/12 sm:w-2/5 rounded-full backdrop-blur-xl border border-1 border-blue-500/10 backdrop-filter bg-blue-900/10 pl-8 pr-8 py-3 items-center ">
      <h1 className="text-2xl font-bold">supamarket</h1>
      <LoginButton />
    </div>
  );
};

export default NavBar;
