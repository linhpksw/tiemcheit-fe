const formidable = require("formidable");
const path = require("path");
const fs = require("fs/promises");

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (req, saveLocally) => {
  const options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/src/assets/images/dishes");
    options.filename = (name, ext, path, form) => {
      return Date.now().toString() + "_" + path.originalFilename;
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler = async (req, res) => {
  const folderPath = path.join(process.cwd(), "/src/assets/images/dishes");
  try {
    await fs.readdir(folderPath);
  } catch (error) {
    await fs.mkdir(folderPath, { recursive: true });
  }
  await readFile(req, true);
  res.json({ done: "ok" });
};


export default handler;
