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
  userAddress: string | null;
  walletAddress: string;
  productFiles?: {
    fileKey: string;
    fileName?: string | null;
  }[];
};

export type AuthParams = {
  signature: string;
  payload: {
    address: string;
    domain: string;
    expiration_time: string;
    invalid_before: string;
    issued_at: string;
    nonce: string;
    statement: string;
    version: string;
  }
}

