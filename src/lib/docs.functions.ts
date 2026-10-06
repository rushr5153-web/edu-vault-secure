import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHash, timingSafeEqual } from "node:crypto";

function checkPassword(input: string) {
  const expected = process.env["UPLOAD_PASSWORD"];
  if (!expected) throw new Error("Server not configured");
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  if (!timingSafeEqual(a, b)) throw new Error("වැරදි password එකක්");
}

export const createUploadUrl = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ password: z.string().max(200), fileName: z.string().min(1).max(300) }).parse(d),
  )
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const safe = data.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${crypto.randomUUID()}-${safe}`;
    const { data: res, error } = await supabaseAdmin.storage
      .from("pdfs")
      .createSignedUploadUrl(path);
    if (error) throw new Error(error.message);
    return { path, token: res.token };
  });

export const saveDocument = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        password: z.string().max(200),
        title: z.string().trim().min(1).max(200),
        description: z.string().trim().max(2000),
        path: z.string().min(1).max(400),
        size: z.number().int().nonnegative(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("documents").insert({
      title: data.title,
      description: data.description,
      file_path: data.path,
      file_size: data.size,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getDownloadUrl = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: doc, error } = await supabaseAdmin
      .from("documents")
      .select("file_path, title")
      .eq("id", data.id)
      .single();
    if (error || !doc) throw new Error("File not found");
    const { data: signed, error: e2 } = await supabaseAdmin.storage
      .from("pdfs")
      .createSignedUrl(doc.file_path, 120, { download: `${doc.title}.pdf` });
    if (e2) throw new Error(e2.message);
    return { url: signed.signedUrl };
  });
