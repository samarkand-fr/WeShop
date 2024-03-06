import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
// import { PrismaClient } from "@prisma/client"
import prisma from "@/libs/prismadb";

// making prisma global look at libs
// const prisma = new PrismaClient()

export const authOptions:AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
      CredentialsProvider({
        name: "credendials",
        credentials: {
          email: {
            label: "email",
            type: "text",
          },
          password: {
            label: "password",
            type: "password",
          },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials.password) {
            throw new Error("invalid email or password");
          }
          // find user from db mongo
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });
          if (!user || !user?.hashedPassword) {
            throw new Error("invalid email or password");
          }
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );
          if (!isCorrectPassword) {
            throw new Error("invalid email or password");
          }
          //  if all checks passes &  correct
          return user;
        },
      }),
    ],
    pages: {
      signIn: "/login",
    },
    debug: process.env.NODE_ENV === "development",
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET
  }
export default NextAuth(authOptions);
