import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const client = await clientPromise;
        const db = client.db("Smart_Inventory_Management");

        const user = await db.collection("users").findOne({
          email: credentials.email,
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt" as const,
  },

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };