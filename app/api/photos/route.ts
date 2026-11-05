import { prisma } from "@/app/_lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

// Бүх зургийн жагсаалт авах
export async function GET() {
  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(photos);
}

// Зураг оруулах
export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file") as File;

const path = `${crypto.randomUUID()}-${file.name}`;

  const { error } = await supabase.storage.from("photos").upload(path, file);
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

   const labelText = form.get("label") as string | null;
  const label =
    labelText === "Cat" ? "CAT" : labelText === "Not cat" ? "NOT_CAT" : null;

  const photo = await prisma.photo.create({ data: { path, label } });
  return Response.json(photo);
}