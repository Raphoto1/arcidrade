import NextAuth, { SessionStrategy } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import prisma from "@/utils/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials) return null;
        const user = await prisma.auth.findUnique({
          where: { email: credentials.email },
        });
        if (user && user.password === credentials.password && user.status === "active") {
          return { id: user.referCode, email: user.email };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt"
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };