import { Request, Response } from "express";
import _fs from "fs";
import fs from "fs/promises";
import { filesUpload } from "../helpers";

export class FileService {
  async uploadFile(req: Request, res: Response) {
    try {
      filesUpload({ fileSizeLimit: 5000000 }).single("file")(
        req,
        res,
        (err: any) => {
          if (err) {
            return res.status(400).json({ error: err.message });
          }
          res
            .status(200)
            .json({ message: "File uploaded successfully!", file: req.file });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async deleteFile(filePath: string) {
    try {
      await fs.unlink(filePath);
      return { message: "File deleted successfully!" };
    } catch (error) {
      console.error(error);
      throw new Error("Error deleting file");
    }
  }

  async addDirectory(directoryPath: string) {
    try {
      await fs.mkdir(directoryPath);
      return { message: "Directory added successfully!" };
    } catch (error) {
      console.error(error);
      throw new Error("Error adding directory");
    }
  }

  async removeDirectory(directoryPath: string) {
    try {
      await fs.rmdir(directoryPath, { recursive: true });
      return { message: "Directory removed successfully!" };
    } catch (error) {
      console.error(error);
      throw new Error("Error removing directory");
    }
  }

  async newDirectory(dest: string) {
    if (!_fs.existsSync(dest)) {
      try {
        _fs.mkdirSync(dest, { recursive: true });
        console.log("Directory created successfully!");
      } catch (error) {
        console.error("Error creating directory:", error);
      }
    } else {
      console.log("Directory already exists.");
    }
  }
}
