import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const addProduct = await prisma.product.create({
      data: {
        name: data.title,
        price: data.price,
        coverImage: data.coverImageKey,
        description: data.description,
        userAddress: data.userAddress,
        image: data.imageKeysResponse.imageKeys,
        walletAddress: data.walletAddress,
        chainId: data.chainId,
        chainName: data.chainName,
        productFiles: {
          create: {
            fileKey: data.productFileKey,
          },
        },
      },
    });

    return new Response(JSON.stringify(addProduct), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error adding product to sale:", error);
    return new Response("Error adding product to sale", { status: 500 });
  }
}
