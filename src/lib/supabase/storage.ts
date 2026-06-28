import { supabase } from "./client";

export const MARK_AVATARS_BUCKET = "mark-avatars";
export const MARK_ATTACHMENTS_BUCKET = "mark-attachments";

type UploadOptions = {
  userId: string;
  file: File;
  pathPrefix?: string;
};

function buildUserScopedPath({ userId, file, pathPrefix = "" }: UploadOptions) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const prefix = pathPrefix ? `${pathPrefix.replace(/^\/|\/$/g, "")}/` : "";
  return `${userId}/${prefix}${crypto.randomUUID()}-${safeName}`;
}

export async function uploadAvatar(options: UploadOptions) {
  const path = buildUserScopedPath(options);
  const result = await supabase.storage.from(MARK_AVATARS_BUCKET).upload(path, options.file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (result.error) return result;

  const { data } = supabase.storage.from(MARK_AVATARS_BUCKET).getPublicUrl(path);
  return { ...result, publicUrl: data.publicUrl };
}

export async function uploadAttachment(options: UploadOptions) {
  const path = buildUserScopedPath(options);
  return supabase.storage.from(MARK_ATTACHMENTS_BUCKET).upload(path, options.file, {
    cacheControl: "3600",
    upsert: false,
  });
}

export async function createAttachmentSignedUrl(path: string, expiresInSeconds = 60 * 10) {
  return supabase.storage.from(MARK_ATTACHMENTS_BUCKET).createSignedUrl(path, expiresInSeconds);
}
