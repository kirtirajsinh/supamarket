// import Product from "@/components/product/Product";
import React from "react";
import type { Metadata } from "next";
import { getProduct } from "@/app/api/actions/getproduct";
import { getFrameMetadata } from "@coinbase/onchainkit/frame";
import { ImageUrl, NEXT_PUBLIC_URL } from "@/utils/const";
import Product from "@/components/product/Product";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const id = params.id;
  console.log(id, "id from metadata");

  let product;

  try {
    product = await getProduct(id);
    console.log(product);
  } catch (error) {
    console.log(error);
  }

  const frameMetadata = getFrameMetadata({
    buttons: [
      {
        label: `${product?.price} Ξ`,
        action: "tx",
        target: `${NEXT_PUBLIC_URL}/api/frame/transaction?productId=${id}`,
        postUrl: `${NEXT_PUBLIC_URL}/api/frame/tx-success`,
      },
      {
        label: "Redeem",
        target: `${NEXT_PUBLIC_URL}/api/frame/redeem`,
      },
    ],
    image: {
      src: product?.coverImage ? `${ImageUrl}/${product.coverImage}` : "",
      aspectRatio: "1.91:1",
    },
    post_url: `${NEXT_PUBLIC_URL}/api/frame?productId=${id}`,
  });

  return {
    title: product?.name,
    description: product?.description,
    openGraph: {
      title: product?.name,
      description: product?.description,
      images: [
        {
          url: product?.coverImage ? `${ImageUrl}/${product.coverImage}` : "",
          width: 800,
          height: 600,
          alt: product?.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product?.name,
      description: product?.description,
      images: product?.image ?? "",
    },
    other: {
      ...frameMetadata,
    },
  };
}
const page = async ({ params }: { params: { id: string } }) => {
  const product = await getProduct(params.id);

  return <>{product && <Product product={product} />}</>;
};

export default page;
