import { Request, Response } from "express";
import AuthService from "./auth.service";

const authService = new AuthService();

export default class AuthController {
  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    const token = await authService.login(username, password);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    return res.json({ accessToken: token });
  }
}
