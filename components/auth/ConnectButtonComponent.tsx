"use client";
import type { NextPage } from "next";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/thirdwebclient";
import {
  addToDatabase,
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/app/api/actions/auth";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { defineChain } from "thirdweb";

const polygon = defineChain({
  id: 137,
});

const base = defineChain({
  id: 84531,
});

const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "farcaster"],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];
const ConnectButtonComponent: NextPage = () => {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      connectModal={{
        size: "compact",
      }}
      connectButton={{
        label: "Login",
        className: "text-xl font-bold  hover:shadow-lg hover:-translate-y-1",
      }}
      chains={[polygon, base]}
      auth={{
        isLoggedIn: async (address) => {
          console.log("checking if logged in!", { address });
          return await isLoggedIn();
        },
        doLogin: async (params) => {
          console.log(params, "logging in!");
          await login(params);

          try {
            const response = await addToDatabase(params);

            console.log("User stored in database:", response);
          } catch (error) {
            console.error("Error storing user in database:", error);
          }
        },
        getLoginPayload: async ({ address }) => generatePayload({ address }),
        doLogout: async () => {
          console.log("logging out!");
          await logout();
        },
      }}
    />
  );
};

export default ConnectButtonComponent;
