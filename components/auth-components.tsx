"use client";

import { Login, Logout } from "@/app/api/actions/login";

export function SignOut() {
  return <button onClick={() => Logout()}>Sign Out</button>;
}

export function SignIn() {
  return (
    <button
      className="bg-purple-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-purple-600 transition duration-300"
      onClick={() => Login("google")}
    >
      Sign In
    </button>
  );
}
