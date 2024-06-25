import path from "path";
export function getImagePath(imageName) {
  const directoryPath = path.join('src', 'assets', 'images', 'dishes');
  return path.join(directoryPath, imageName)
}