import { type FileRouter, createUploadthing } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  profileImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 4 },
  }).onUploadComplete(() => {}),
  fileUpload: f({
    pdf: { maxFileSize: "1GB" },
    image: { maxFileSize: "1GB" },
    text: { maxFileSize: "1GB" },
  }).onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
