export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadImage(blob: Blob): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", blob, "image.jpg");

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error ?? "Échec de l'envoi de l'image.",
      };
    }

    return { success: true, url: data.url };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur inconnue lors de l'envoi de l'image.",
    };
  }
}
