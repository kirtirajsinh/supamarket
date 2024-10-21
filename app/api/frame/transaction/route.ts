import {
  FrameRequest,
  FrameTransactionResponse,
} from "@coinbase/onchainkit/frame";
import { NextResponse } from "next/server";
import { parseEther } from "viem";
import { baseSepolia } from "viem/chains";
import { getProduct } from "../../actions/getproduct";

export async function POST(req: Request) {
  const body: FrameRequest = await req.json();
  console.log(body);

  // Extract the product ID from the URL
  const url = body.untrustedData.url;
  const productId = url.split("/").pop();

  console.log("Product ID:", productId);

  if (productId) {
    const productData = await getProduct(productId);

    if (productData) {
      const txData: FrameTransactionResponse = {
        chainId: `eip155:${baseSepolia.id}`,
        method: "eth_sendTransaction",
        params: {
          abi: [],
          to: productData.walletAddress as `0x${string}`,
          value: parseEther(productData.price.toString()).toString(),
        },
      };

      return NextResponse.json(txData);
    } else {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
  } else {
    return NextResponse.json(
      { error: "Product ID not found" },
      { status: 400 }
    );
  }

  // return new NextResponse(
  //   getFrameHtmlResponse({
  //     buttons: [
  //       {
  //         label: `Tx: ${body?.untrustedData?.transactionId || "--"}`,
  //       },
  //     ],
  //     image: {
  //       src: `${NEXT_PUBLIC_URL}/vercel.svg`,
  //     },
  //   })
  // );
}
