export type Product = {
  id: string;
  name: string;
  price: number;
  image: string[];
  coverImage: string;
  description: string;
  isAvailableForPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
  walletAddress: string;
  productFiles?: {
    fileKey: string;
    fileName?: string | null;
  }[];
};
