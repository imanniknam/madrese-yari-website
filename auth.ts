import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/account/login" },
  providers: [
    Credentials({
      id: "password",
      name: "ورود با رمز عبور",
      credentials: {
        phone: { label: "شماره موبایل", type: "text" },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials) {
        const phone = credentials?.phone as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!phone || !password) return null;

        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user || !user.passwordHash) return null;
        if (!verifyPassword(password, user.passwordHash)) return null;

        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`.trim(),
          phone: user.phone,
          role: user.role,
          isAdmin: user.isAdmin,
        };
      },
    }),
    Credentials({
      id: "admin",
      name: "ورود مدیر",
      credentials: {
        phone: { label: "شماره موبایل", type: "text" },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials) {
        const phone = credentials?.phone as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!phone || !password) return null;

        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user || !user.passwordHash || !user.isAdmin) return null;
        if (!verifyPassword(password, user.passwordHash)) return null;

        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`.trim(),
          phone: user.phone,
          role: user.role,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = (user as { role?: string }).role;
        token.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { id?: string; role?: string; isAdmin?: boolean }).id = token.uid as string;
        (session.user as typeof session.user & { id?: string; role?: string; isAdmin?: boolean }).role = token.role as string;
        (session.user as typeof session.user & { id?: string; role?: string; isAdmin?: boolean }).isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
});
