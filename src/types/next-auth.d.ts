import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User {
    referCode: string;
    area: string;
  }

  interface Session {
    user: {
      id: string
      email: string
      referCode: string
      area: string
    }
  }

  interface JWT {
    email?: string;
    referCode?: string;
    area?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string
  }
}
