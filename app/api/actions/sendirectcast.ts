import { messageTemplate } from "@/utils/const";
import { v4 as uuidv4 } from "uuid";
export const sendDirectCast = async (fid: number, message: string) => {
  const data = {
    recipientFid: fid,
    message: `${messageTemplate}\n\n ${message}`,
    idempotencyKey: uuidv4(),
  };
  try {
    const message = await fetch(
      `https://api.warpcast.com/v2/ext-send-direct-cast `,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.WARPCAST_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    console.log(message);
    return message;
  } catch (error) {
    console.log(error);
  }
};
