import { uploadFileToR2 } from "@/lib/files";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const formData = await req.formData();

  const images = formData.getAll("images") as File[];
  const uploadedImageKeys: string[] = [];

  console.log("I am uploading the images Array", images);

  const directory = uuidv4();

  console.log("I am uploading the images Array", directory);

  try {
    for (let i = 0; i < images.length; i++) {
      const image = images[i] as File;
      const fileKey = `${directory}/${image.name}`;

      console.log(`Uploading image ${i + 1}: ${fileKey}`);

      await uploadFileToR2(image, "supamarket", fileKey);
      uploadedImageKeys.push(fileKey);

      console.log(`Uploaded image ${i + 1}: ${fileKey}`);
    }

    console.log("Uploaded Image Keys:", uploadedImageKeys);

    return Response.json({ success: true, imageKeys: uploadedImageKeys });
  } catch (error) {
    console.error("Error uploading images:", error);
    return Response.json(
      { success: false, error: "Failed to upload images" },
      { status: 500 }
    );
  }
}
