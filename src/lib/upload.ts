import { createClient } from "@/lib/supabase/client";

const MAX = 5 * 1024 * 1024;

/** Görseli 1600px'e küçültüp JPEG olarak sıkıştırır (telefon fotoğrafları çok büyük oluyor). */
async function shrink(file: File, maxSide = 1600): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.82));
    return blob ?? file;
  } catch {
    return file;
  }
}

/** Restoranın klasörüne görsel yükler, herkese açık adresini döndürür. */
export async function uploadMedia(restaurantId: string, file: File, kind: string): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Sadece fotoğraf yükleyebilirsiniz.");
  const blob = await shrink(file, kind === "logo" ? 512 : 1600);
  if (blob.size > MAX) throw new Error("Fotoğraf çok büyük (en fazla 5 MB).");
  const supabase = createClient();
  const path = `${restaurantId}/${kind}-${Date.now()}.jpg`;
  const { error } = await supabase.storage.from("media").upload(path, blob, {
    contentType: "image/jpeg",
    cacheControl: "31536000",
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}
