const imagePath = process.env.NEXT_PUBLIC_S3_ENDPOINT;

export function getImagePath(imageName) {
	return `${imagePath}/${imageName}` || "";
}
