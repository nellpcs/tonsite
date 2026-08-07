import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireBoutiqueId } from "@/lib/session";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

export async function POST(request: Request) {
  let boutiqueId: string;
  try {
    boutiqueId = await requireBoutiqueId();
  } catch {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Format non supporté. Utilisez JPG, PNG ou WEBP." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Fichier trop volumineux (5 Mo maximum)." },
      { status: 400 }
    );
  }

  const extension = file.type.split("/")[1];
  const filename = `${boutiqueId}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${extension}`;

  try {
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch {
    return NextResponse.json(
      {
        error:
          "Échec de l'envoi de l'image. Vérifiez que BLOB_READ_WRITE_TOKEN est configuré.",
      },
      { status: 500 }
    );
  }
}
