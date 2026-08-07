import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      vendeurId: string;
      boutiqueId: string;
    };
  }

  interface User extends DefaultUser {
    boutiqueId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    vendeurId: string;
    boutiqueId: string;
  }
}
