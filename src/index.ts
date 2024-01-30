import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { validateApiKey } from "./middlewares/apikey.middleware";
import { FileService } from "./services/file.service";

dotenv.config();

const fileService = new FileService();
const app: Express = express();
const port = process.env.PORT || 3301;

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: "Content-Type, Authorization",
};

const corsMiddleware = cors(corsOptions);

app.use(corsMiddleware);
app.use(express.json());
app.use(validateApiKey);

app.post("/upload", async (req, res) => {
  try {
    await fileService.uploadFile(req, res);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
});

app.delete("/directory", async (req, res) => {
  try {
    await fileService.removeDirectory(req.body.path);
    return res.status(201).json({ msg: "Directory removed successfully" });
  } catch (error) {
    return res.status(500).json({ err: error });
  }
});

app.delete("/file", async (req, res) => {
  try {
    await fileService.deleteFile(req.body.path);
    return res.status(201).json({ msg: "File removed successfully" });
  } catch (error) {
    return res.status(500).json({ err: error });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
