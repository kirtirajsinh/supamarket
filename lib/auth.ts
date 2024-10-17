import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email === "kirrttiraj1907@gmail.com") {
        await prisma.user.update({
          where: { email: user.email },
          data: {
            role: "ADMIN",
          },
        });
      }
      console.log(user, "user from auth");
      return true;
    },
    async session({ session, user }) {
      if (user) {
        // Access userId from user object
        session.user.id = user.id;
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.image = user.image;
        return session;
      }
      return session;
    },
  },
  //
  debug: true,
});
