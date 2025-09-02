import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";


import prisma from "@/utils/db";
import { authOptions } from "@/utils/authOptions";


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
