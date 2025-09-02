import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

import prisma from "@/utils/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Ingresa tu email" },
        password: { label: "Password", type: "password", placeholder: "Ingresa tu contraseña" },
      },
      async authorize(credentials: { email: string; password: string } | undefined) {
        if (!credentials) return null;

        const userFound = await prisma.auth.findUnique({
          where: { email: credentials.email },
        });
        if (!userFound) return null;

        const isMatch = await bcrypt.compare(credentials.password, userFound.password);
        if (!isMatch) return null;

        return {
          id: userFound.referCode,
          email: userFound.email,
          referCode: userFound.referCode,
          area: userFound.area,
        };
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
        token.id = user.id as string;
        token.email = user.email as string;
        token.referCode = user.referCode as string;
        token.area = user.area as string;
      }
      return token;
    },
    session({ session, token }: any) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.referCode = token.referCode as string;
        session.user.area = token.area as string;
      }
      return session;
    },
  },
};
