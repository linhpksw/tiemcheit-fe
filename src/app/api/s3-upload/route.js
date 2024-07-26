import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import mime from "mime-types";

const s3Client = new S3Client({
	region: process.env.NEXT_PUBLIC_S3_REGION,
	credentials: {
		accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
		secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
	},
});

async function uploadFileToS3(file, fileName, directory) {
	const fileBuffer = file;
	const mimeType = mime.lookup(fileName) || "application/octet-stream"; // Fallback type
	const params = {
		Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
		Key: `${directory}/${fileName}`,
		Body: fileBuffer,
		ContentDisposition: "inline", // Ensure the file is displayed inline
		ContentType: mimeType, // Set the correct MIME type
	};

	const command = new PutObjectCommand(params);
	await s3Client.send(command);
}

export async function POST(request) {
	try {
		const formData = await request.formData();
		const file = formData.get("file");
		const directory = formData.get("directory");

		if (!file) {
			return NextResponse.json({ error: "File is required." }, { status: 400 });
		}

		const buffer = Buffer.from(await file.arrayBuffer());
		await uploadFileToS3(buffer, file.name, directory);

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
