"use client";

import { Login, Logout } from "@/app/api/actions/login";

export function SignOut() {
  return <button onClick={() => Logout()}>Sign Out</button>;
}

export function SignIn() {
  return <button onClick={() => Login("google")}>Sign In</button>;
}
