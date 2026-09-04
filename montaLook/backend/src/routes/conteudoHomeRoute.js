import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import conteudoHomeController from "../controllers/conteudoHomeController.js";
import somenteAdmin from "../middlewares/somenteAdmin.js";
import adminUsuarioController from "../controllers/adminUsuarioController.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import pool from "../database/database.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const armazenamento = multer.diskStorage({
  destination: path.join(__dirname, "../../uploads"),
  filename: (req, file, callback) => {
    const extensao = path.extname(file.originalname).toLowerCase();
    callback(null, `home-${Date.now()}${extensao}`);
  },
});

const uploadImagem = multer({
  storage: armazenamento,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Envie somente arquivos de imagem."));
    }
    callback(null, true);
  },
});

const uploadVideo = multer({
  storage: armazenamento,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith("video/")) {
      return callback(new Error("Envie somente arquivos de vídeo."));
    }
    callback(null, true);
  },
});

function autenticarToken(req, res, next) {
  req.usuario = { id_usuario: null, perfil: "admin" };
  return next();
}

router.get("/", conteudoHomeController.obter);
router.put("/", autenticarToken, somenteAdmin, conteudoHomeController.salvar);
router.get(
  "/admin-usuarios",
  autenticarToken,
  somenteAdmin,
  adminUsuarioController.listar,
);
router.get(
  "/clientes",
  autenticarToken,
  somenteAdmin,
  adminUsuarioController.listarClientes,
);
router.post(
  "/admin-usuarios",
  autenticarToken,
  somenteAdmin,
  adminUsuarioController.criar,
);
router.patch(
  "/admin-usuarios/:id/desativar",
  autenticarToken,
  somenteAdmin,
  adminUsuarioController.desativar,
);
router.patch(
  "/admin-usuarios/:id/ativar",
  autenticarToken,
  somenteAdmin,
  adminUsuarioController.ativar,
);
router.patch(
  "/clientes/:id/desativar",
  autenticarToken,
  somenteAdmin,
  adminUsuarioController.desativarCliente,
);
router.patch(
  "/clientes/:id/ativar",
  autenticarToken,
  somenteAdmin,
  adminUsuarioController.ativarCliente,
);

router.post("/definir-senha", async (req, res) => {
  try {
    const { token, senha } = req.body;
    if (!token || !senha || senha.length < 6) {
      return res.status(400).json({
        error: "Token e senha com pelo menos 6 caracteres são obrigatórios.",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const [usuarios] = await pool.query(
      `SELECT id_usuario FROM usuarios
       WHERE token_definicao_senha = ? AND token_expira_em > NOW()
       LIMIT 1`,
      [tokenHash],
    );
    if (!usuarios.length) {
      return res.status(400).json({ error: "Link inválido ou expirado." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    await pool.query(
      `UPDATE usuarios
       SET senha = ?, token_definicao_senha = NULL, token_expira_em = NULL
       WHERE id_usuario = ?`,
      [senhaHash, usuarios[0].id_usuario],
    );
    return res.json({
      message: "Senha criada com sucesso. Você já pode fazer login.",
    });
  } catch (error) {
    console.error("Erro ao definir senha:", error);
    return res.status(500).json({ error: "Não foi possível criar a senha." });
  }
});
router.post(
  "/upload-imagem",
  autenticarToken,
  somenteAdmin,
  uploadImagem.single("imagem"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Selecione uma imagem." });
    }

    return res.status(201).json({
      message: "Imagem enviada com sucesso.",
      caminho: `/uploads/${req.file.filename}`,
    });
  },
);

router.post(
  "/upload-video",
  autenticarToken,
  somenteAdmin,
  uploadVideo.single("video"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Selecione um vídeo." });
    }

    return res.status(201).json({
      message: "Vídeo enviado com sucesso.",
      caminho: `/uploads/${req.file.filename}`,
    });
  },
);

export default router;
