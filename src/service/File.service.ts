import { put, del } from "@vercel/blob";

export const uploadFileService = async (file: File, folder: String, id: String | null | undefined) => {
  const blob = await put(`usersData/${id}/${folder}/${file.name}`, file, {
    access: "public",
    addRandomSuffix: false,
  });
  console.log("blob en back", blob);
  console.log("url to save", blob.url);
  return blob;
};

export const deleteFileService = async (fileUrl:string) => {
  const deleteBlob = await del(fileUrl);
  return deleteBlob;
}