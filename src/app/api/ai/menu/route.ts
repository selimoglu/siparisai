import { NextResponse } from "next/server";
import { getOwnerContext } from "@/lib/supabase/server";
import { readMenu } from "@/lib/ai";

export const maxDuration = 120;

const OK_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
type OkType = (typeof OK_TYPES)[number];
const MAX_FILES = 4;
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: Request) {
  const { userId } = await getOwnerContext();
  if (!userId) return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });

  const form = await req.formData();
  const text = String(form.get("text") ?? "").slice(0, 20000);
  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length > MAX_FILES)
    return NextResponse.json({ error: `En fazla ${MAX_FILES} fotoğraf yükleyin.` }, { status: 400 });
  const images: { mediaType: OkType; base64: string }[] = [];
  for (const f of files) {
    if (!OK_TYPES.includes(f.type as OkType))
      return NextResponse.json({ error: "Sadece JPG, PNG veya WEBP yükleyin." }, { status: 400 });
    if (f.size > MAX_BYTES)
      return NextResponse.json({ error: "Her fotoğraf en fazla 5 MB olabilir." }, { status: 400 });
    images.push({ mediaType: f.type as OkType, base64: Buffer.from(await f.arrayBuffer()).toString("base64") });
  }
  if (!images.length && !text.trim())
    return NextResponse.json({ error: "Menü fotoğrafı yükleyin veya menüyü yapıştırın." }, { status: 400 });

  try {
    const menu = await readMenu({ images, text });
    return NextResponse.json(menu);
  } catch (e) {
    console.error("menu ai error", e);
    return NextResponse.json({ error: "Menü okunamadı. Daha net bir fotoğrafla tekrar deneyin." }, { status: 502 });
  }
}
