import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://f5a2aee7664d9a450c48e8c6218f15a9.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY ?? "",
  },
});

export const uploadFileToR2 = async (
  file: File,
  bucket: string,
  key: string
) => {
  const productFile = await file.arrayBuffer();
  const productFileBuffer = Buffer.from(productFile);

  const params = {
    Bucket: bucket,
    Key: key,
    Body: productFileBuffer,
    ContentType: file.type,
  };
  try {
    const response = await s3Client.send(new PutObjectCommand(params));
    console.log("File uploaded successfully:", response);
    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const getPresignedUrl = async (
  productFileKey: string,
  bucket: string
) => {
  try {
    const url = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucket,
        Key: productFileKey,
      }),
      { expiresIn: 7 * 24 * 60 * 60 }
    );
    console.log(url, "Presigned url");

    return url;
  } catch (error) {
    console.log(error, "Error getting presigned url");
    return null;
  }
};
