// pages/api/upload.js
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = "./assets/images/dishes";
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: "Đã xảy ra lỗi khi xử lý tệp." });
      return;
    }

    const filePath = files.upload.path;
    const fileName = files.upload.name;

    const newFilePath = path.join("./assets/images/dishes", fileName);
    
    fs.rename(filePath, newFilePath, (err) => {
      if (err) {
        res.status(500).json({ error: "Không thể lưu tệp." });
        return;
      }

      res.status(200).json({ message: "Tệp đã được tải lên thành công." });
    });
  });
};
