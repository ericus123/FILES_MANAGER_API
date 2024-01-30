import dotenv from "dotenv";
import { Request } from "express";
import multer from "multer";
import path from "path";
import { FileService } from "../services/file.service";

dotenv.config();
const base_path = process.env.DEST_PATH;

const getName = (file: any) => {
  const name = `${file?.originalname
    .split(".")[0]
    ?.split(" ")
    .join("_")}_${Date.now()}${path.extname(file.originalname)}`;
  return name;
};

export const fileStorage = multer.diskStorage({
  destination: async (req, file, callback) => {
    let type = req.query.type;

    if (type == undefined) {
      throw new Error("Subfolder should is undefined");
    }
    let path = `${base_path}/${type}`;

    const final_destination = path;
    const fileService = new FileService();
    await fileService.newDirectory(final_destination);
    callback(null, final_destination);
    req.body.final_destination = final_destination;
  },
  filename: (req: Request, file: any, cb: any) => {
    const name = getName(file);
    req.body.name = name;

    const file_name = Date.now()
      .toString()
      ?.concat(path.extname(file.originalname));
    cb(null, file_name);
  },
});

interface MulterParams {
  fileSizeLimit?: number;
}

export const filesUpload = (params?: MulterParams) =>
  multer({
    storage: fileStorage,
    limits: {
      fileSize: params?.fileSizeLimit || 1000000000,
    },
    fileFilter(req: Request, file: any, cb: any) {
      if (file.size > (params?.fileSizeLimit || 1000000000)) {
        req.body.error = "FILE_SIZE_EXCEEDED";
        cb(null, false);
        return cb(new Error("File size exceeds the allowed limit!"));
      }
      cb(undefined, true);
    },
  });
