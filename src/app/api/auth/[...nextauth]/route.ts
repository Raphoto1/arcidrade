import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import prisma from "@/utils/db";


export const authOptions = {
    providers: [
       CredentialsProvider({
         name: "Credentials",
         credentials: {
           email: { label: "Email", type: "email", placeholder: "Ingresa tu email"},
           password: { label: "Password", type: "password", placeholder: "Ingresa tu contraseña" },
         },
         async authorize(credentials: Record<string, string> | undefined, req) {
           console.log('Credenciales recibidas:', credentials);
           if (!credentials) return null;
           const userFound = await prisma.auth.findUnique({
             where: { email: credentials.email },
           });
             console.log('user desde nextAuth', userFound);
             if (!userFound) return null;
             const compare = async () => {
               const isMatch = await bcrypt.compare(credentials.password, userFound.password);
               return isMatch ? userFound : null;
             };
             return compare();
         }
       })
    ],
    pages: {
      signIn: '/auth/login',
      signOut: '/auth/logOut',
    }
}


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };