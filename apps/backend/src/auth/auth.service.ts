import jwt from "jsonwebtoken";

export default class AuthService {
  async login(username: string, password: string): Promise<string | null> {
    // Skeleton: en un futuro se validará contra la base de datos
    if (username === "admin" && password === "admin") {
      const token = jwt.sign(
        { sub: username },
        process.env.JWT_SECRET || "dev-secret",
        {
          expiresIn: "1h",
        }
      );
      return token;
    }
    return null;
  }
}
