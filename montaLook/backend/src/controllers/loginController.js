// import pool from "../database/database.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// class LoginController {
//     async login(req, res) {
//         try {
//             const { email, senha } = req.body;

//             if (!email || !senha) {
//                 return res.status(400).json({ error: "Informe o e-mail e a senha." });
//             }

//             const sql = `
//                 SELECT 
//                     u.id_usuario,
//                     u.nome,
//                     u.email,
//                     u.senha,
//                     u.status AS status_usuario,
//                     u.data_criacao,
//                     a.id_assinatura,
//                     a.status AS status_assinatura,
//                     a.data_inicio
//                 FROM Usuarios u
//                 LEFT JOIN Assinaturas a 
//                     ON u.id_usuario = a.id_usuario 
//                     AND a.status IN ('Ativo', 'Ativa', 'Trial')
//                 WHERE u.email = ?
//                 ORDER BY a.id_assinatura DESC
//                 LIMIT 1
//             `;

//             const [rows] = await pool.query(sql, [email]);

//             if (rows.length === 0) {
//                 return res.status(401).json({ error: "E-mail ou senha inválidos." });
//             }

//             const dadosUsuario = rows[0];
//             const senhaValida = await bcrypt.compare(senha, dadosUsuario.senha);

//             if (!senhaValida) {
//                 return res.status(401).json({ error: "E-mail ou senha inválidos." });
//             }

//             if (dadosUsuario.status_usuario !== "ativo") {
//                 return res.status(403).json({ error: "Usuário inativo. Entre em contato com o suporte." });
//             }

//             if (!dadosUsuario.id_assinatura) {
//                 return res.status(403).json({ error: "Você não possui um plano ativo." });
//             }

//             const secretKey = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

//             const token = jwt.sign(
//                 { 
//                     id_usuario: dadosUsuario.id_usuario, 
//                     email: dadosUsuario.email 
//                 },
//                 secretKey,
//                 { expiresIn: "8h" }
//             );

//             return res.status(200).json({
//                 message: "Login realizado com sucesso!",
//                 token,
//                 usuario: {
//                     id: dadosUsuario.id_usuario,
//                     nome: dadosUsuario.nome,
//                     email: dadosUsuario.email,
//                     data_criacao: dadosUsuario.data_criacao
//                 },
//                 assinatura: {
//                     id: dadosUsuario.id_assinatura,
//                     status: dadosUsuario.status_assinatura,
//                     data_inicio: dadosUsuario.data_inicio
//                 }
//             });

//         } catch (erro) {
//             console.error("Erro no login:", erro);
//             return res.status(500).json({ error: "Erro interno do servidor." });
//         }
//     }
// }

// export default new LoginController();



import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../database/database.js";

export const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: "Informe o e-mail e a senha." });
        }

        const [rows] = await pool.query(
            "SELECT id_usuario, nome, username, email, foto, bio, status, senha FROM Usuarios WHERE email = ? LIMIT 1",
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: "E-mail ou senha inválidos." });
        }

        const usuario = rows[0];

        if (usuario.status === "pendente") {
            return res.status(403).json({ 
                error: "Sua conta ainda não foi ativada. Verifique seu e-mail para confirmar o cadastro." 
            });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: "E-mail ou senha inválidos." });
        }

        const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "sua_chave_secreta_aqui";
        const token = jwt.sign(
            { id: usuario.id_usuario, email: usuario.email },
            SECRET_KEY,
            { expiresIn: "8h" }
        );

        // Retorna o token e os dados completos do usuário
        return res.status(200).json({
            message: "Login realizado com sucesso!",
            token,
            usuario: {
                id: usuario.id_usuario,
                nome: usuario.nome,
                username: usuario.username || "",
                email: usuario.email,
                foto: usuario.foto || null,
                bio: usuario.bio || ""
            }
        });

    } catch (error) {
        console.error("🔥 Erro na rota de login:", error);
        return res.status(500).json({ error: "Erro interno no servidor ao tentar realizar login." });
    }
};

export default { login };