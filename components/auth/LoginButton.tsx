import React from "react";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { SignIn, SignOut } from "@/components/auth-components";

const LoginButton = async () => {
  const session = await auth();
  if (!session?.user) return <SignIn />;

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "User"}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
      </div>
      <SignOut />
    </div>
  );
};

export default LoginButton;
