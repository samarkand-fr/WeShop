import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/libs/prismadb";
import { getServerSession } from "next-auth";

export async function getSesssion() {
  return getServerSession(authOptions);
}

export default async function getCurrentUser() {
  // Do not swallow Next.js dynamic-rendering signals from getServerSession.
  // A missing session is normal; infrastructure/database errors should remain visible.
  const session = await getSesssion();
  if (!session?.user?.email) return null;

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { orders: true },
  });

  if (!currentUser) return null;

  return {
    ...currentUser,
    createdAt: currentUser.createdAt.toISOString(),
    updatedAt: currentUser.updatedAt.toISOString(),
    emailVerified: currentUser.emailVerified?.toISOString() ?? null,
  };
}
