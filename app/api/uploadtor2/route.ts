import { uploadFileToR2 } from "@/lib/files";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const formData = await req.formData();

  // Extracting product file
  const file = formData.get("productFile") as File;
  const productFileKey = `${uuidv4()}-${file.name}`;
  try {
    await uploadFileToR2(file, "supamarket-private", productFileKey);
    // return new Response("File uploaded successfully", { status: 200 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new Response("Error uploading file", { status: 500 });
  }

  // Extract Cover Image
  const coverImage = formData.get("coverImage") as File;
  const coverImageKey = `${uuidv4()}-${coverImage.name}`;
  try {
    await uploadFileToR2(coverImage, "supamarket", coverImageKey);
    // return new Response("Cover Image uploaded successfully", { status: 200 });
  } catch (error) {
    console.error("Error uploading CoverImage:", error);
    return new Response("Error uploading CoverImage", { status: 500 });
  }

  return new Response(
    JSON.stringify({
      productFileKey,
      coverImageKey,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
