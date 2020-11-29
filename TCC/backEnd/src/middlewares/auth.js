import jwt from "jsonwebtoken";
import authConfig from "../config/auth";

export default async (req, res, next) => {
  import { promisify } from "util";
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: " Token not provided" });
  }
  // Verificao se o token do usuario está valido ou não
  const [, token] = authHeader.split(" ");

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token Invalido!" });
  }


};
