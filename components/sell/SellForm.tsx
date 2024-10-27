"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import { base, baseSepolia, optimism } from "viem/chains";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(50, "Title must not exceed 50 characters"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(5000, "Description must not exceed 500 characters"),
  productFile: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 5MB"),
  images: z
    .array(z.instanceof(File))
    .refine(
      (files) =>
        files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Invalid file type"
    )
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      "Max file size is 5MB"
    )
    .refine(
      (files) => files.length <= 5,
      "You can upload a maximum of 5 images"
    ),
  coverImage: z
    .instanceof(File)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Invalid file type"
    )
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 5MB"),
  price: z.number().positive("Price must be a positive number"),
  chainId: z.number().min(1, "Please select a chain"),
  chainName: z.string().min(1, "Please select a chain"),
});

type FormValues = z.infer<typeof formSchema>;

const SellForm = () => {
  // const session = useSession();
  const activeAccount = useActiveAccount();

  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [progress, setProgress] = useState(0);
  const [isUpLoading, setIsUpLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      images: [],
      chainId: baseSepolia.id,
      chainName: baseSepolia.name,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: FormValues) => {
    if (!activeAccount?.address || !activeAccount) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit a product.",
        variant: "destructive",
      });
      return;
    }

    console.log("Form Data:", values);
    setIsUpLoading(true);

    setProgress(50);

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("productFile", values.productFile);
    values.images.forEach((image) => {
      formData.append(`images`, image);
    });
    formData.append("price", values.price.toString());
    formData.append("userId", activeAccount?.address);
    formData.append("coverImage", values.coverImage);
    formData.append("chainId", values.chainId.toString());
    formData.append("chainName", values.chainName);

    // Array.from(formData.entries()).forEach(([key, value]) => {
    //   console.log(`${key}: ${value}`); // Log key-value pairs of formData
    // });

    try {
      // Upload Product File to r2
      const uploadProductFile = await fetch("/api/uploadtor2", {
        method: "POST",
        body: formData,
      });

      if (!uploadProductFile.ok) {
        throw new Error("Failed to upload product file");
      }

      const { productFileKey, coverImageKey } = await uploadProductFile.json();

      const uploadImages = await fetch("/api/uploadimages", {
        method: "POST",
        body: formData,
      });
      if (!uploadImages.ok) {
        throw new Error("Failed to upload images");
      }

      const imageKeysResponse = await uploadImages.json();
      console.log(imageKeysResponse, "imageKeysResponse");

      const respones = await fetch("/api/addtosale", {
        method: "POST",
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          price: values.price,
          userAddress: activeAccount?.address,
          productFileKey,
          coverImageKey,
          imageKeysResponse,
          walletAddress: activeAccount?.address,
          chainId: values.chainId,
          chainName: values.chainName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!respones.ok) {
        throw new Error("Failed to add product to sale");
      }
      const data = await respones.json();
      console.log("Product added to sale:", data);

      setProgress(100);
      toast({
        title: "Success",
        description: "Your product has been successfully uploaded!",
      });
      form.reset();
      router.push("/market");
      setActiveTab("details");
      setIsUpLoading(false);
    } catch (error) {
      console.error("Error uploading product:", error);
      toast({
        title: "Error",
        description: "Failed to upload product. Please try again.",
        variant: "destructive",
      });
      setIsUpLoading(false);
    } finally {
      setProgress(0);
      setIsUpLoading(false);
    }
  };

  //   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const files = Array.from(e.target.files || []);
  //     form.setValue("images", [...form.getValues("images"), ...files]);
  //   };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images");
    currentImages.splice(index, 1);
    form.setValue("images", currentImages);
  };

  const isTabComplete = useCallback(
    (tabName: string) => {
      const values = form.getValues();
      switch (tabName) {
        case "details":
          return !!values.title && !!values.description && !!values.price;
        case "images":
          return values.images.length > 0;
        case "file":
          return !!values.productFile;
        default:
          return false;
      }
    },
    [form]
  );

  const handleTabChange = (value: string) => {
    if (isTabComplete(activeTab)) {
      setActiveTab(value);
    } else {
      toast({
        title: "Incomplete Section",
        description:
          "Please complete the current section before moving to the next.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    const incompleteTab = ["details", "images", "file"].find(
      (tab) => !isTabComplete(tab)
    );
    if (incompleteTab) {
      setActiveTab(incompleteTab);
      toast({
        title: "Incomplete Form",
        description: `Please complete the ${incompleteTab} section.`,
        variant: "destructive",
      });
    } else {
      onSubmit(data);
    }
  });

  return (
    <Card className="w-full max-w-2xl mx-auto mt-32">
      <CardHeader>
        <CardTitle>Sell Your Product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="file">Product File</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product title" {...field} />
                        </FormControl>
                        <FormDescription>
                          Provide a catchy title for your product
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your product"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description of your product
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.005"
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Set the Price of your Product in Eth
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="chainId"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Network</FormLabel>
                          <FormControl>
                            <select
                              className="w-full p-2 border rounded-md"
                              {...field}
                              onChange={(e) => {
                                const selectedChainId = parseInt(
                                  e.target.value
                                );
                                field.onChange(selectedChainId);

                                // set chain Name
                                let chainName = "";
                                switch (selectedChainId) {
                                  case base.id:
                                    chainName = base.name;
                                    break;
                                  case baseSepolia.id:
                                    chainName = baseSepolia.name;
                                    break;
                                  case optimism.id:
                                    chainName = optimism.name;
                                    break;
                                }
                                form.setValue("chainName", chainName);
                              }}
                            >
                              <option value={base.id}>Base</option>
                              <option value={baseSepolia.id}>
                                Base Sepolia
                              </option>
                              <option value={optimism.id}>Optimism</option>
                            </select>
                          </FormControl>
                          <FormDescription>
                            Select the network for your product
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="images">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image</FormLabel>
                        <FormControl>
                          <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-md">
                            <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              {field.value
                                ? field.value.name
                                : "Select a cover image"}
                            </p>
                            <Input
                              type="file"
                              accept={ACCEPTED_IMAGE_TYPES.join(",")}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                field.onChange(file);
                              }}
                              className="hidden"
                              id="cover-image-upload"
                            />
                            <Button asChild>
                              <label htmlFor="cover-image-upload">
                                Select Cover Image
                              </label>
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload a cover image for your product (max 5MB)
                        </FormDescription>
                        <FormMessage />
                        {field.value && (
                          <div className="mt-4 relative">
                            <Image
                              src={URL.createObjectURL(field.value)}
                              alt="Cover Image Preview"
                              width={100}
                              height={100} // Adjust height for 16:9 aspect ratio
                              className="w-full object-cover rounded-md"
                            />

                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-0 right-0 -mt-2 -mr-2"
                              onClick={() => field.onChange(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Images</FormLabel>
                        <FormControl>
                          <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-md">
                            <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              Drag and drop your images here, or click to select
                              files
                            </p>
                            <Input
                              type="file"
                              accept={ACCEPTED_IMAGE_TYPES.join(",")}
                              multiple
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                const updatedImages = [
                                  ...form.getValues("images"),
                                  ...files,
                                ];

                                form.setValue("images", updatedImages);
                                field.onChange(updatedImages); // Update form field through React Hook Form
                              }}
                              className="hidden"
                              id="image-upload"
                            />
                            <Button asChild>
                              <label htmlFor="image-upload">
                                Select Images
                              </label>
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload up to 5 images (max 5MB each)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    {form.watch("images").map((file, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0 -mt-2 -mr-2"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="file">
                <FormField
                  control={form.control}
                  name="productFile"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Product File</FormLabel>
                      <FormControl>
                        <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-md">
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            {value?.name || "No file selected"}{" "}
                            {/* Display file name if selected */}
                          </p>
                          <Input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              onChange(file || null);
                            }}
                            {...rest}
                            className="hidden"
                            id="product-file-upload"
                          />
                          <Button asChild>
                            <label htmlFor="product-file-upload">
                              Select File
                            </label>
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload the product file (max 5MB)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            {progress > 0 && <Progress value={progress} className="w-full" />}
            {isTabComplete("details") &&
              isTabComplete("images") &&
              isTabComplete("file") && (
                <Button type="submit" className="w-full" disabled={isUpLoading}>
                  Submit Product
                </Button>
              )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SellForm;
