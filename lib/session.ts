import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireBoutiqueId() {
  const session = await getServerSession(authOptions);
  const boutiqueId = session?.user?.boutiqueId;

  if (!boutiqueId) {
    throw new Error("Non authentifié.");
  }

  return boutiqueId;
}
