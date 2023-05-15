import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      result: string,
      message: string,
      data: {
        token: string
      }
    };
  }
}