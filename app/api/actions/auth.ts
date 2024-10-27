"use server";
import { VerifyLoginPayloadParams, createAuth } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";
import { client } from "@/lib/thirdwebclient";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { AuthParams } from "@/types/product";

// import { prisma } from "@/lib/prisma";

const privateKey = process.env.THIRDWEB_ADMIN_PRIVATE_KEY || "";

if (!privateKey) {
    throw new Error("Missing THIRDWEB_ADMIN_PRIVATE_KEY in .env file.");
}

const thirdwebAuth = createAuth({
    domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
    client,
    adminAccount: privateKeyToAccount({ client, privateKey }),
});

export const generatePayload = thirdwebAuth.generatePayload;

export async function login(payload: VerifyLoginPayloadParams) {
    const verifiedPayload = await thirdwebAuth.verifyPayload(payload);
    if (verifiedPayload.valid) {
        const jwt = await thirdwebAuth.generateJWT({
            payload: verifiedPayload.payload,
        });
        cookies().set("jwt", jwt);
    }
}

export async function isLoggedIn() {
    const jwt = cookies().get("jwt");
    if (!jwt?.value) {
        return false;
    }

    const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value });
    if (!authResult.valid) {
        return false;
    }
    return true;
}

export async function logout() {
    cookies().delete("jwt");
}

export async function addToDatabase(params: AuthParams) {
    console.log("params", params);
    try {
        const user = await prisma.user.upsert({
            where: { address: params.payload.address },
            update: {},
            create: { address: params.payload.address },
        });

        console.log("user", user);
        return user;
    } catch (error) {
        console.error("Error storing user in database:", error);
    }
}
