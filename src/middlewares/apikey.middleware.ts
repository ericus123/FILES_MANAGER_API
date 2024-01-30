import { Request, Response } from "express";
import { HashingService } from "../services/hash.service";

const hashService = new HashingService();
export const validateApiKey = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const apiKey = req.headers.authorization;

  if (!apiKey) {
    return res.status(401).json({ error: "Unauthorized - Invalid API key" });
  }

  const isMatch = await hashService.isMatch(apiKey);

  if (!isMatch) {
    return res.status(401).json({ error: "Unauthorized - Invalid API key" });
  }

  next();
};
