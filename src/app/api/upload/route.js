import { writeFile } from "fs/promises"
import { NextResponse } from "next/server"
import path from "path";

export async function POST(request) {
try {
  const data = await request.formData()
  const files  = data.getAll("images")

  if (!files.length) {
    console.error('Không có file nào được upload.');
    return NextResponse.json({ success: false, message: 'No files uploaded' });
  }
  
  const directoryPath = path.join(process.cwd(), 'src', 'assets', 'images', 'dishes');

  try {
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = file.name;
      const filePath = path.join(directoryPath, fileName);

      await writeFile(filePath, buffer);
      console.log(`File đã được lưu vào: ${filePath}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lỗi khi lưu file:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
} catch (error) {
  console.error('Lỗi trong quá trình xử lý request:', error);
  return NextResponse.json({ success: false, error: error.message });
} 
}