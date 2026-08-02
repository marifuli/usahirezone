import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase/firebase";

export async function uploadFile(
  path: string,
  file: File
): Promise<string> {
  // File storage backend is temporarily disabled.
  // Returning local file name mock reference.
  console.log(`[Storage Disabled] File ${file.name} was selected but not saved on backend.`);
  return `mock-storage://${path}/${file.name}`;
}

export async function uploadResume(
  userId: string,
  file: File
): Promise<string> {
  const extension = file.name.split(".").pop() ?? "pdf";
  const path = `resumes/${userId}/${Date.now()}.${extension}`;
  return uploadFile(path, file);
}

export async function uploadDocument(
  userId: string,
  file: File
): Promise<string> {
  const extension = file.name.split(".").pop() ?? "pdf";
  const path = `documents/${userId}/${Date.now()}.${extension}`;
  return uploadFile(path, file);
}

export async function deleteFile(url: string): Promise<void> {
  console.log(`[Storage Disabled] Request to delete ${url}`);
}
