import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import prisma from "@/utils/db";

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Ingresa tu email" },
        password: { label: "Password", type: "password", placeholder: "Ingresa tu contraseña" },
      },
      async authorize(credentials: Record<string, string> | undefined, req) {
        if (!credentials) return null;
        const userFound = await prisma.auth.findUnique({
          where: { email: credentials.email },
        });
        if (!userFound) return null;
        const compare = async () => {
          const isMatch = await bcrypt.compare(credentials.password, userFound.password);
          if (isMatch) {
            const { password, ...userWithoutPassword } = userFound;
            return userWithoutPassword;
          }
          return isMatch ? userFound : null;
        };
        if (await compare()) {
          const { password, ...userWithoutPassword } = userFound;
          console.log("user sin password", userWithoutPassword);
          return userWithoutPassword;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logOut",
  },
  callbacks: {
    jwt({ token, user }: any) {
      if (user) {
        token.email = user.email;
        token.referCode = user.referCode;
        token.area = user.area;
      }
      return token;
    },
    session({ session, token }: any) {
      if (token) {
        session.user.email = token.email;
        session.user.referCode = token.referCode;
        session.user.area = token.area;
      }
      return session;
    },
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
