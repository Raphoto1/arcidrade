import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

import prisma from "@/utils/db";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Ingresa tu email" },
        password: { label: "Password", type: "password", placeholder: "Ingresa tu contraseña" },
      },
      async authorize(credentials: { email: string; password: string } | undefined) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const userFound = await prisma.auth.findUnique({
            where: { email: credentials.email },
            select: {
              referCode: true,
              email: true,
              password: true,
              area: true,
              status: true,
            }
          });
          
          if (!userFound) {
            return null;
          }

          // Verificar que el usuario no esté desactivado
          if (userFound.status === 'desactivated') {
            return null;
          }

          const isMatch = await bcrypt.compare(credentials.password, userFound.password);
          if (!isMatch) {
            return null;
          }

          return {
            id: userFound.referCode,
            email: userFound.email,
            referCode: userFound.referCode,
            area: userFound.area,
          };
        } catch (error) {
          // Diferenciar entre errores de conexión y otros errores
          const errorMsg = error instanceof Error ? error.message : String(error);
          const errorCode = (error as any)?.code;
          
          // Log detallado para debugging
          console.error('[AUTH] Authorization error:', {
            message: errorMsg,
            code: errorCode,
            email: credentials.email,
            timestamp: new Date().toISOString(),
            connectionError: errorMsg.includes('connect') || 
                           errorMsg.includes('timeout') || 
                           errorMsg.includes('ECONNREFUSED') ||
                           errorMsg.includes('ECONNRESET')
          });
          
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
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
