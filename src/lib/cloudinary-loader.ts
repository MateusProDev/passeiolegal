import type { ImageLoaderProps } from "next/image";

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  const uploadPath = "/image/upload/";
  const uploadIndex = src.indexOf(uploadPath);

  if (
    !src.startsWith("https://res.cloudinary.com/") ||
    uploadIndex === -1
  ) {
    return src;
  }

  const transformations = `f_auto,q_${quality ?? "auto"},w_${width},c_limit`;
  const insertionIndex = uploadIndex + uploadPath.length;

  return `${src.slice(0, insertionIndex)}${transformations}/${src.slice(insertionIndex)}`;
}
