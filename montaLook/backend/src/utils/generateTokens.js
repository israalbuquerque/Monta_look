import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class GenerateTokens {
  generateAccessToken(usuario) {
    const secret =
      process.env.ACCESS_TOKEN_SECRET ||
      process.env.JWT_SECRET ||
      "sua_chave_secreta_aqui";
    return jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        email: usuario.email,
        perfil: usuario.perfil || "cliente",
      },
      secret,
      { expiresIn: "15m" },
    );
  }

  generateRefreshToken(usuario) {
    const secret =
      process.env.REFRESH_TOKEN_SECRET ||
      process.env.JWT_SECRET ||
      "sua_chave_refresh_aqui";
    return jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        email: usuario.email,
        perfil: usuario.perfil || "cliente",
      },
      secret,
      { expiresIn: "7d" },
    );
  }
}

export default new GenerateTokens();
