import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        await connectDB();

        const user = await User.findOne({
          email: credentials.email,
        });

        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          name: user.name,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },

  jwt: {
    maxAge: 60 * 60 * 24,
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.name = (user as any).name;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        session.user.name = token.name as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};