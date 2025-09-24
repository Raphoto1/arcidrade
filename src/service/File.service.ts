import { put, del } from "@vercel/blob";

export const uploadFileService = async (file: File, folder: String, user_id: String | null | undefined) => {
  const blob = await put(`usersData/${user_id}/${folder}/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return blob;
};

export const deleteFileService = async (fileUrl: string) => {
  const deleteBlob = await del(fileUrl);
  return deleteBlob;
};
