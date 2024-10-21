import { FrameRequest, getFrameHtmlResponse } from "@coinbase/onchainkit/frame";
import { NextResponse } from "next/server";
import { getProduct } from "../../actions/getproduct";
import { errorImage, notPaidImage, redeemImage } from "@/utils/const";
import { checkOrderPresent } from "@/lib/utils";
import { getPresignedUrl } from "@/lib/files";
import { sendDirectCast } from "../../actions/sendirectcast";

export async function POST(req: Request) {
  const body: FrameRequest = await req.json();
  console.log(body);

  // Extract the product ID from the URL
  const url = body.untrustedData.url;
  const productId = url.split("/").pop();

  console.log("Product ID:", productId);

  if (productId) {
    const productData = await getProduct(productId, true);
    console.log(productData, "productData from redeem");
    if (productData) {
      const checkOrder = await checkOrderPresent(
        productData.id,
        body.untrustedData.fid
      );

      if (!checkOrder) {
        console.log("No order found");
        return new NextResponse(
          getFrameHtmlResponse({
            image: {
              src: notPaidImage,
            },
          })
        );
      }
      console.log(checkOrder, "passed CheckOrder from redeem");
      if (checkOrder) {
        if (
          "productFiles" in productData &&
          Array.isArray(productData.productFiles) &&
          productData.productFiles.length > 0
        ) {
          const fileKey = productData.productFiles[0].fileKey;

          const generatePreSignedUrl = await getPresignedUrl(
            fileKey,
            "supamarket-private"
          );
          if (generatePreSignedUrl) {
            try {
              const message = await sendDirectCast(
                body.untrustedData.fid,
                generatePreSignedUrl
              );
              console.log(message, "message from redeem");
              return new NextResponse(
                getFrameHtmlResponse({
                  image: {
                    src: redeemImage,
                  },
                })
              );
            } catch (error) {
              console.log(error);
              return new NextResponse(
                getFrameHtmlResponse({
                  image: {
                    src: errorImage,
                  },
                })
              );
            }
          }
        }
      }
    } else {
      return new NextResponse(
        getFrameHtmlResponse({
          image: {
            src: errorImage,
          },
        })
      );
    }
  } else {
    return NextResponse.json(
      { error: "Product ID not found" },
      { status: 400 }
    );
  }
}
