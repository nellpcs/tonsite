import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/connexion",
  },
  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const vendeur = await prisma.vendeur.findUnique({
          where: { email: credentials.email },
        });

        if (!vendeur) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          vendeur.motDePasseHash
        );

        if (!isValid) {
          return null;
        }

        return {
          id: vendeur.id,
          email: vendeur.email,
          name: vendeur.nom,
          boutiqueId: vendeur.boutiqueId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.vendeurId = user.id;
        token.boutiqueId = user.boutiqueId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.vendeurId = token.vendeurId;
      session.user.boutiqueId = token.boutiqueId;
      return session;
    },
  },
};
