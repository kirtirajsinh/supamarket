import { FrameRequest, getFrameHtmlResponse } from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "../../actions/getproduct";
import { checkOrderPresent, createOrder } from "@/lib/utils";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();

  console.log(body, "body from success");

  const url = body.untrustedData.url;
  const productId = url.split("/").pop();

  console.log("Product ID:", productId);

  if (productId) {
    const productData = await getProduct(productId);

    if (productData) {
      const checkOrder = await checkOrderPresent(
        productData.id,
        body.untrustedData.fid
      );
      console.log(checkOrder, "checkOrder from success");
      if (!checkOrder) {
        const order = await createOrder(
          productData.id,
          productData.price,
          body.untrustedData.fid
        );
        console.log(order, "order from success");
      }
    }

    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: `Redeem your Purchase`,
          },
        ],
        image: {
          src: `https://pub-b8acacbdf4c34874a29a2fdaab996f29.r2.dev/Group%201%20(1).jpg`,
        },
        post_url: "https://supamarket.xyz/api/frame/redeem",
      })
    );
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Error: Product not found`,
        },
      ],
      image: {
        src: `https://pub-b8acacbdf4c34874a29a2fdaab996f29.r2.dev/error.jpg`,
      },
    })
  );
}
export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
