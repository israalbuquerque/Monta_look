// import express from "express";
// import bcrypt from "bcrypt";
// import loginController from "../controllers/loginController.js";
// import pool from "../database/database.js";

// const router = express.Router();

// router.post("/login", loginController.login);

// router.post("/cadastro", async (req, res) => {
//   try {
//     const { nome, email, cpf, telefone, senha } = req.body;

//     if (!nome || !email || !cpf || !senha) {
//       return res.status(400).json({ error: "É necessário informar nome, e-mail, CPF e senha." });
//     }

//     // 1. Checa se e-mail ou CPF já existem
//     const [usuarioExistente] = await pool.query(
//       "SELECT id_usuario FROM Usuarios WHERE email = ? OR cpf = ? LIMIT 1",
//       [email, cpf]
//     );

//     if (usuarioExistente.length > 0) {
//       return res.status(400).json({ error: "E-mail ou CPF já cadastrados no sistema." });
//     }

//     // 2. Hash da senha
//     const saltRounds = 10;
//     const senhaHash = await bcrypt.hash(senha, saltRounds);

//     // 3. Cadastra o Usuário
//     const [resultado] = await pool.query(
//       `INSERT INTO Usuarios (nome, email, cpf, telefone, senha, status, data_criacao) 
//        VALUES (?, ?, ?, ?, ?, 'ativo', NOW())`,
//       [nome, email, cpf, telefone || null, senhaHash]
//     );

//     const novoIdUsuario = resultado.insertId;

//     // 4. Busca o plano gratuito "Degustação (Gratuito)" usando a coluna 'nome_plano'
//     const [planoGratuito] = await pool.query(
//       "SELECT id_plano FROM Planos WHERE nome_plano LIKE '%Degustação%' LIMIT 1"
//     );

//     // Se encontrar o plano (id_plano = 1), insere a assinatura
//     if (planoGratuito.length > 0) {
//       await pool.query(
//         `INSERT INTO Assinaturas (id_usuario, id_plano, status, data_inicio) 
//          VALUES (?, ?, 'Trial', NOW())`,
//         [novoIdUsuario, planoGratuito[0].id_plano]
//       );
//     }

//     return res.status(201).json({
//       message: "Usuário cadastrado com sucesso!",
//       id_usuario: novoIdUsuario
//     });

//   } catch (error) {
//     console.error("Erro no cadastro de usuário:", error);
//     return res.status(500).json({ error: "Erro interno no servidor ao realizar cadastro." });
//   }
// });

// app.get('/perfil', autenticarToken, async (req, res) => {
//     try {
//         // Exemplo recuperando o usuário do banco (ajuste conforme seu BD/Query)
//         const usuario = await buscarUsuarioPorId(req.usuario.id);

//         if (!usuario) {
//             return res.status(404).json({ error: "Usuário não encontrado." });
//         }

//         // RETORNA UM JSON VÁLIDO
//         return res.status(200).json({
//             usuario: {
//                 nome: usuario.nome,
//                 username: usuario.username,
//                 email: usuario.email,
//                 foto: usuario.foto,
//                 bio: usuario.bio,
//                 plano: usuario.plano
//             }
//         });
//     } catch (error) {
//         return res.status(500).json({ error: "Erro interno no servidor." });
//     }
// });

// export default router;




















// import express from "express";
// import bcrypt from "bcrypt";
// import loginController from "../controllers/loginController.js";
// import pool from "../database/database.js";
// // Certifique-se de ajustar o caminho do seu middleware de autenticação JWT se ele estiver em outro arquivo
// import autenticarToken from "../middlewares/autenticarToken.js"; 

// const router = express.Router();

// // ROTA DE LOGIN
// router.post("/login", loginController.login);

// // ROTA DE CADASTRO
// router.post("/cadastro", async (req, res) => {
//   try {
//     const { nome, email, cpf, telefone, senha } = req.body;

//     if (!nome || !email || !cpf || !senha) {
//       return res.status(400).json({ error: "É necessário informar nome, e-mail, CPF e senha." });
//     }

//     // 1. Checa se e-mail ou CPF já existem
//     const [usuarioExistente] = await pool.query(
//       "SELECT id_usuario FROM Usuarios WHERE email = ? OR cpf = ? LIMIT 1",
//       [email, cpf]
//     );

//     if (usuarioExistente.length > 0) {
//       return res.status(400).json({ error: "E-mail ou CPF já cadastrados no sistema." });
//     }

//     // 2. Hash da senha
//     const saltRounds = 10;
//     const senhaHash = await bcrypt.hash(senha, saltRounds);

//     // 3. Cadastra o Usuário
//     const [resultado] = await pool.query(
//       `INSERT INTO Usuarios (nome, email, cpf, telefone, senha, status, data_criacao) 
//        VALUES (?, ?, ?, ?, ?, 'ativo', NOW())`,
//       [nome, email, cpf, telefone || null, senhaHash]
//     );

//     const novoIdUsuario = resultado.insertId;

//     // 4. Busca o plano gratuito "Degustação (Gratuito)" usando a coluna 'nome_plano'
//     const [planoGratuito] = await pool.query(
//       "SELECT id_plano FROM Planos WHERE nome_plano LIKE '%Degustação%' LIMIT 1"
//     );

//     // Se encontrar o plano, insere a assinatura
//     if (planoGratuito.length > 0) {
//       await pool.query(
//         `INSERT INTO Assinaturas (id_usuario, id_plano, status, data_inicio) 
//          VALUES (?, ?, 'Trial', NOW())`,
//         [novoIdUsuario, planoGratuito[0].id_plano]
//       );
//     }

//     return res.status(201).json({
//       message: "Usuário cadastrado com sucesso!",
//       id_usuario: novoIdUsuario
//     });

//   } catch (error) {
//     console.error("Erro no cadastro de usuário:", error);
//     return res.status(500).json({ error: "Erro interno no servidor ao realizar cadastro." });
//   }
// });

// // ROTA DE CONSULTA DO PERFIL (Alterado de app.get para router.get)
// router.get("/perfil", autenticarToken, async (req, res) => {
//     try {
//         // req.usuario.id vem do payload decodificado pelo middleware JWT (autenticarToken)
//         const idUsuario = req.usuario.id || req.usuario.id_usuario;

//         // Query no MySQL buscando os dados do usuário + nome do plano atual
//         const [rows] = await pool.query(
//             `SELECT u.nome, u.email, u.username, u.foto, u.bio, p.nome_plano AS plano
//              FROM Usuarios u
//              LEFT JOIN Assinaturas a ON u.id_usuario = a.id_usuario
//              LEFT JOIN Planos p ON a.id_plano = p.id_plano
//              WHERE u.id_usuario = ? 
//              LIMIT 1`,
//             [idUsuario]
//         );

//         if (rows.length === 0) {
//             return res.status(404).json({ error: "Usuário não encontrado." });
//         }

//         const usuario = rows[0];

//         return res.status(200).json({
//             usuario: {
//                 nome: usuario.nome,
//                 username: usuario.username || "",
//                 email: usuario.email,
//                 foto: usuario.foto || null,
//                 bio: usuario.bio || "",
//                 plano: usuario.plano || "Essencial"
//             }
//         });
//     } catch (error) {
//         console.error("Erro na rota GET /perfil:", error);
//         return res.status(500).json({ error: "Erro interno no servidor ao buscar perfil." });
//     }
// });

// // ROTA DE ATUALIZAÇÃO DO PERFIL (PUT)
// router.put("/perfil", autenticarToken, async (req, res) => {
//     try {
//         const idUsuario = req.usuario.id || req.usuario.id_usuario;
//         const { nome, username, email, foto, bio, novaSenha } = req.body;

//         // 1. Atualiza dados básicos
//         let query = `UPDATE Usuarios SET nome = ?, username = ?, email = ?, foto = ?, bio = ?`;
//         let params = [nome, username, email, foto, bio];

//         // 2. Se enviou nova senha, adiciona no update
//         if (novaSenha && novaSenha.trim() !== "") {
//             const senhaHash = await bcrypt.hash(novaSenha, 10);
//             query += `, senha = ?`;
//             params.push(senhaHash);
//         }

//         query += ` WHERE id_usuario = ?`;
//         params.push(idUsuario);

//         await pool.query(query, params);

//         return res.status(200).json({ message: "Perfil atualizado com sucesso!" });
//     } catch (error) {
//         console.error("Erro na rota PUT /perfil:", error);
//         return res.status(500).json({ error: "Erro ao atualizar dados do perfil." });
//     }
// });

// export default router;











// import express from "express";
// import bcrypt from "bcrypt";
// import loginController from "../controllers/loginController.js";
// import pool from "../database/database.js";

// const router = express.Router();

// router.post("/login", loginController.login);

// router.post("/cadastro", async (req, res) => {
//   try {
//     const { nome, email, cpf, telefone, senha } = req.body;

//     if (!nome || !email || !cpf || !senha) {
//       return res.status(400).json({ error: "É necessário informar nome, e-mail, CPF e senha." });
//     }

//     // 1. Checa se e-mail ou CPF já existem
//     const [usuarioExistente] = await pool.query(
//       "SELECT id_usuario FROM Usuarios WHERE email = ? OR cpf = ? LIMIT 1",
//       [email, cpf]
//     );

//     if (usuarioExistente.length > 0) {
//       return res.status(400).json({ error: "E-mail ou CPF já cadastrados no sistema." });
//     }

//     // 2. Hash da senha
//     const saltRounds = 10;
//     const senhaHash = await bcrypt.hash(senha, saltRounds);

//     // 3. Cadastra o Usuário
//     const [resultado] = await pool.query(
//       `INSERT INTO Usuarios (nome, email, cpf, telefone, senha, status, data_criacao) 
//        VALUES (?, ?, ?, ?, ?, 'ativo', NOW())`,
//       [nome, email, cpf, telefone || null, senhaHash]
//     );

//     const novoIdUsuario = resultado.insertId;

//     // 4. Busca o plano gratuito "Degustação (Gratuito)" usando a coluna 'nome_plano'
//     const [planoGratuito] = await pool.query(
//       "SELECT id_plano FROM Planos WHERE nome_plano LIKE '%Degustação%' LIMIT 1"
//     );

//     // Se encontrar o plano (id_plano = 1), insere a assinatura
//     if (planoGratuito.length > 0) {
//       await pool.query(
//         `INSERT INTO Assinaturas (id_usuario, id_plano, status, data_inicio) 
//          VALUES (?, ?, 'Trial', NOW())`,
//         [novoIdUsuario, planoGratuito[0].id_plano]
//       );
//     }

//     return res.status(201).json({
//       message: "Usuário cadastrado com sucesso!",
//       id_usuario: novoIdUsuario
//     });

//   } catch (error) {
//     console.error("Erro no cadastro de usuário:", error);
//     return res.status(500).json({ error: "Erro interno no servidor ao realizar cadastro." });
//   }
// });

// app.get('/perfil', autenticarToken, async (req, res) => {
//     try {
//         // Exemplo recuperando o usuário do banco (ajuste conforme seu BD/Query)
//         const usuario = await buscarUsuarioPorId(req.usuario.id);

//         if (!usuario) {
//             return res.status(404).json({ error: "Usuário não encontrado." });
//         }

//         // RETORNA UM JSON VÁLIDO
//         return res.status(200).json({
//             usuario: {
//                 nome: usuario.nome,
//                 username: usuario.username,
//                 email: usuario.email,
//                 foto: usuario.foto,
//                 bio: usuario.bio,
//                 plano: usuario.plano
//             }
//         });
//     } catch (error) {
//         return res.status(500).json({ error: "Erro interno no servidor." });
//     }
// });

// export default router;




















// import express from "express";
// import bcrypt from "bcrypt";
// import loginController from "../controllers/loginController.js";
// import pool from "../database/database.js";
// // Certifique-se de ajustar o caminho do seu middleware de autenticação JWT se ele estiver em outro arquivo
// import autenticarToken from "../middlewares/autenticarToken.js"; 

// const router = express.Router();

// // ROTA DE LOGIN
// router.post("/login", loginController.login);

// // ROTA DE CADASTRO
// router.post("/cadastro", async (req, res) => {
//   try {
//     const { nome, email, cpf, telefone, senha } = req.body;

//     if (!nome || !email || !cpf || !senha) {
//       return res.status(400).json({ error: "É necessário informar nome, e-mail, CPF e senha." });
//     }

//     // 1. Checa se e-mail ou CPF já existem
//     const [usuarioExistente] = await pool.query(
//       "SELECT id_usuario FROM Usuarios WHERE email = ? OR cpf = ? LIMIT 1",
//       [email, cpf]
//     );

//     if (usuarioExistente.length > 0) {
//       return res.status(400).json({ error: "E-mail ou CPF já cadastrados no sistema." });
//     }

//     // 2. Hash da senha
//     const saltRounds = 10;
//     const senhaHash = await bcrypt.hash(senha, saltRounds);

//     // 3. Cadastra o Usuário
//     const [resultado] = await pool.query(
//       `INSERT INTO Usuarios (nome, email, cpf, telefone, senha, status, data_criacao) 
//        VALUES (?, ?, ?, ?, ?, 'ativo', NOW())`,
//       [nome, email, cpf, telefone || null, senhaHash]
//     );

//     const novoIdUsuario = resultado.insertId;

//     // 4. Busca o plano gratuito "Degustação (Gratuito)" usando a coluna 'nome_plano'
//     const [planoGratuito] = await pool.query(
//       "SELECT id_plano FROM Planos WHERE nome_plano LIKE '%Degustação%' LIMIT 1"
//     );

//     // Se encontrar o plano, insere a assinatura
//     if (planoGratuito.length > 0) {
//       await pool.query(
//         `INSERT INTO Assinaturas (id_usuario, id_plano, status, data_inicio) 
//          VALUES (?, ?, 'Trial', NOW())`,
//         [novoIdUsuario, planoGratuito[0].id_plano]
//       );
//     }

//     return res.status(201).json({
//       message: "Usuário cadastrado com sucesso!",
//       id_usuario: novoIdUsuario
//     });

//   } catch (error) {
//     console.error("Erro no cadastro de usuário:", error);
//     return res.status(500).json({ error: "Erro interno no servidor ao realizar cadastro." });
//   }
// });

// // ROTA DE CONSULTA DO PERFIL (Alterado de app.get para router.get)
// router.get("/perfil", autenticarToken, async (req, res) => {
//     try {
//         // req.usuario.id vem do payload decodificado pelo middleware JWT (autenticarToken)
//         const idUsuario = req.usuario.id || req.usuario.id_usuario;

//         // Query no MySQL buscando os dados do usuário + nome do plano atual
//         const [rows] = await pool.query(
//             `SELECT u.nome, u.email, u.username, u.foto, u.bio, p.nome_plano AS plano
//              FROM Usuarios u
//              LEFT JOIN Assinaturas a ON u.id_usuario = a.id_usuario
//              LEFT JOIN Planos p ON a.id_plano = p.id_plano
//              WHERE u.id_usuario = ? 
//              LIMIT 1`,
//             [idUsuario]
//         );

//         if (rows.length === 0) {
//             return res.status(404).json({ error: "Usuário não encontrado." });
//         }

//         const usuario = rows[0];

//         return res.status(200).json({
//             usuario: {
//                 nome: usuario.nome,
//                 username: usuario.username || "",
//                 email: usuario.email,
//                 foto: usuario.foto || null,
//                 bio: usuario.bio || "",
//                 plano: usuario.plano || "Essencial"
//             }
//         });
//     } catch (error) {
//         console.error("Erro na rota GET /perfil:", error);
//         return res.status(500).json({ error: "Erro interno no servidor ao buscar perfil." });
//     }
// });

// // ROTA DE ATUALIZAÇÃO DO PERFIL (PUT)
// router.put("/perfil", autenticarToken, async (req, res) => {
//     try {
//         const idUsuario = req.usuario.id || req.usuario.id_usuario;
//         const { nome, username, email, foto, bio, novaSenha } = req.body;

//         // 1. Atualiza dados básicos
//         let query = `UPDATE Usuarios SET nome = ?, username = ?, email = ?, foto = ?, bio = ?`;
//         let params = [nome, username, email, foto, bio];

//         // 2. Se enviou nova senha, adiciona no update
//         if (novaSenha && novaSenha.trim() !== "") {
//             const senhaHash = await bcrypt.hash(novaSenha, 10);
//             query += `, senha = ?`;
//             params.push(senhaHash);
//         }

//         query += ` WHERE id_usuario = ?`;
//         params.push(idUsuario);

//         await pool.query(query, params);

//         return res.status(200).json({ message: "Perfil atualizado com sucesso!" });
//     } catch (error) {
//         console.error("Erro na rota PUT /perfil:", error);
//         return res.status(500).json({ error: "Erro ao atualizar dados do perfil." });
//     }
// });

// export default router;












// import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import loginController from "../controllers/loginController.js";
// import pool from "../database/database.js";

// const router = express.Router();

// // Middleware centralizado de autenticação JWT
// const autenticarToken = (req, res, next) => {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];

//     if (!token) {
//         return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
//     }

//     const SECRET_KEY = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

//     try {
//         req.usuario = jwt.verify(token, SECRET_KEY);
//         next();
//     } catch (err) {
//         return res.status(403).json({ error: "Token inválido ou expirado." });
//     }
// };

// // ROTA DE LOGIN
// router.post("/login", loginController.login);

// // ROTA DE CADASTRO
// router.post("/cadastro", async (req, res) => {
//     try {
//         const { nome, email, cpf, telefone, senha } = req.body;

//         if (!nome || !email || !cpf || !senha) {
//             return res.status(400).json({ error: "É necessário informar nome, e-mail, CPF e senha." });
//         }

//         const [usuarioExistente] = await pool.query(
//             "SELECT id_usuario FROM Usuarios WHERE email = ? OR cpf = ? LIMIT 1",
//             [email, cpf]
//         );

//         if (usuarioExistente.length > 0) {
//             return res.status(400).json({ error: "E-mail ou CPF já cadastrados no sistema." });
//         }

//         const saltRounds = 10;
//         const senhaHash = await bcrypt.hash(senha, saltRounds);

//         const [resultado] = await pool.query(
//             `INSERT INTO Usuarios (nome, email, cpf, telefone, senha, status, data_criacao) 
//              VALUES (?, ?, ?, ?, ?, 'ativo', NOW())`,
//             [nome, email, cpf, telefone || null, senhaHash]
//         );

//         const novoIdUsuario = resultado.insertId;

//        // ✅ Pega o plano enviado do body ou usa 'Degustação' como fallback
// const { nome, email, cpf, telefone, senha, plano } = req.body;

// let idPlanoFinal = null;
// if (plano) {
//     const [planoEncontrado] = await pool.query(
//         "SELECT id_plano FROM Planos WHERE nome_plano LIKE ? LIMIT 1",
//         [`%${plano}%`]
//     );
//     if (planoEncontrado.length > 0) idPlanoFinal = planoEncontrado[0].id_plano;
// }

// if (!idPlanoFinal) {
//     const [planoGratuito] = await pool.query(
//         "SELECT id_plano FROM Planos WHERE nome_plano LIKE '%Degustação%' LIMIT 1"
//     );
//     if (planoGratuito.length > 0) idPlanoFinal = planoGratuito[0].id_plano;
// }

// if (idPlanoFinal) {
//     await pool.query(
//         `INSERT INTO Assinaturas (id_usuario, id_plano, status, data_inicio) 
//          VALUES (?, ?, 'Trial', NOW())`,
//         [novoIdUsuario, idPlanoFinal]
//     );
// }

//         if (planoGratuito.length > 0) {
//             await pool.query(
//                 `INSERT INTO Assinaturas (id_usuario, id_plano, status, data_inicio) 
//                  VALUES (?, ?, 'Trial', NOW())`,
//                 [novoIdUsuario, planoGratuito[0].id_plano]
//             );
//         }

//         return res.status(201).json({
//             message: "Usuário cadastrado com sucesso!",
//             id_usuario: novoIdUsuario
//         });

//     } catch (error) {
//         console.error("Erro no cadastro de usuário:", error);
//         return res.status(500).json({ error: "Erro interno no servidor ao realizar cadastro." });
//     }
// });

// // ROTA GET /perfil
// router.get("/perfil", autenticarToken, async (req, res) => {
//     try {
//         const idUsuario = req.usuario.id || req.usuario.id_usuario;

//         // Query ajustada sem colunas inexistentes no banco
//         const [rows] = await pool.query(
//             `SELECT u.nome, u.email, p.nome_plano AS plano
//              FROM Usuarios u
//              LEFT JOIN Assinaturas a ON u.id_usuario = a.id_usuario
//              LEFT JOIN Planos p ON a.id_plano = p.id_plano
//              WHERE u.id_usuario = ? 
//              LIMIT 1`,
//             [idUsuario]
//         );

//         if (rows.length === 0) {
//             return res.status(404).json({ error: "Usuário não encontrado." });
//         }

//         const usuario = rows[0];

//         return res.status(200).json({
//             usuario: {
//                 nome: usuario.nome,
//                 username: "",
//                 email: usuario.email,
//                 foto: null,
//                 bio: "",
//                 plano: usuario.plano || "Essencial"
//             }
//         });
//     } catch (error) {
//         console.error("Erro na rota GET /perfil:", error);
//         return res.status(500).json({ error: "Erro interno no servidor ao buscar perfil." });
//     }
// });

// // // ROTA PUT /perfil
// // router.put("/perfil", autenticarToken, async (req, res) => {
// //     try {
// //         const idUsuario = req.usuario.id || req.usuario.id_usuario;
// //         const { nome, email, novaSenha } = req.body;

// //         let query = `UPDATE Usuarios SET nome = ?, email = ?`;
// //         let params = [nome, email];

// //         if (novaSenha && novaSenha.trim() !== "") {
// //             const senhaHash = await bcrypt.hash(novaSenha, 10);
// //             query += `, senha = ?`;
// //             params.push(senhaHash);
// //         }

// //         query += ` WHERE id_usuario = ?`;
// //         params.push(idUsuario);

// //         await pool.query(query, params);

// //         return res.status(200).json({ message: "Perfil atualizado com sucesso!" });
// //     } catch (error) {
// //         console.error("Erro na rota PUT /perfil:", error);
// //         return res.status(500).json({ error: "Erro ao atualizar dados do perfil." });
// //     }
// // });




// // ROTA PUT /perfil - Atualiza os dados do perfil e o plano do usuário
// router.put("/perfil", autenticarToken, async (req, res) => {
//     try {
//         const idUsuario = req.usuario.id || req.usuario.id_usuario;
//         const { foto, nome, username, email, bio, plano, novaSenha } = req.body;

//         // 1. Busca o id_plano correspondente ao nome do plano selecionado
//         let idPlano = null;
//         if (plano) {
//             const [planoRows] = await pool.query(
//                 "SELECT id_plano FROM Planos WHERE nome_plano LIKE ? LIMIT 1",
//                 [`%${plano}%`]
//             );
//             if (planoRows.length > 0) {
//                 idPlano = planoRows[0].id_plano;
//             }
//         }

//         // 2. Monta a query dinâmica de atualização do Usuário
//         let campos = [
//             "foto = ?",
//             "nome = ?",
//             "username = ?",
//             "email = ?",
//             "bio = ?"
//         ];
//         let valores = [
//             foto || null,
//             nome,
//             username || null,
//             email,
//             bio || null
//         ];

//       // ✅ CORREÇÃO: Atualiza a tabela Assinaturas separadamente
// if (idPlano) {
//     await pool.query(
//         `INSERT INTO Assinaturas (id_usuario, id_plano, status, data_inicio)
//          VALUES (?, ?, 'Ativo', NOW())
//          ON DUPLICATE KEY UPDATE id_plano = VALUES(id_plano)`,
//         [idUsuario, idPlano]
//     );
// }

//         // Caso o usuário tenha informado uma nova senha
//         if (novaSenha && novaSenha.trim() !== "") {
//             const senhaHash = await bcrypt.hash(novaSenha, 10);
//             campos.push("senha = ?");
//             valores.push(senhaHash);
//         }

//         // Adiciona o ID do usuário no final do array de parâmetros
//         valores.push(idUsuario);

//         const querySql = `UPDATE Usuarios SET ${campos.join(", ")} WHERE id_usuario = ?`;

//         await pool.query(querySql, valores);

//         return res.status(200).json({ message: "Perfil e plano atualizados com sucesso!" });

//     } catch (error) {
//         console.error("Erro na rota PUT /perfil:", error);

//         // Tratamento de erro para username/email/cpf duplicados (Erro ER_DUP_ENTRY do MySQL)
//         if (error.code === 'ER_DUP_ENTRY') {
//             return res.status(400).json({ error: "O username ou e-mail informado já está em uso." });
//         }

//         return res.status(500).json({ error: "Erro interno ao atualizar os dados do perfil." });
//     }
// });

// export default router;









// import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import loginController from "../controllers/loginController.js";
// import pool from "../database/database.js";

// const router = express.Router();

// // Middleware centralizado de autenticação JWT
// const autenticarToken = (req, res, next) => {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];

//     if (!token) {
//         return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
//     }

//     const SECRET_KEY = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

//     try {
//         req.usuario = jwt.verify(token, SECRET_KEY);
//         next();
//     } catch (err) {
//         return res.status(403).json({ error: "Token inválido ou expirado." });
//     }
// };

// // ROTA DE LOGIN
// router.post("/login", loginController.login);

// // ROTA DE CADASTRO
// router.post("/cadastro", async (req, res) => {
//     try {
//         const { nome, email, cpf, telefone, senha, plano } = req.body;

//         if (!nome || !email || !cpf || !senha) {
//             return res.status(400).json({ error: "É necessário informar nome, e-mail, CPF e senha." });
//         }

//         const [usuarioExistente] = await pool.query(
//             "SELECT id_usuario FROM Usuarios WHERE email = ? OR cpf = ? LIMIT 1",
//             [email, cpf]
//         );

//         if (usuarioExistente.length > 0) {
//             return res.status(400).json({ error: "E-mail ou CPF já cadastrados no sistema." });
//         }

//         const saltRounds = 10;
//         const senhaHash = await bcrypt.hash(senha, saltRounds);

//         const [resultado] = await pool.query(
//             `INSERT INTO Usuarios (nome, email, cpf, telefone, senha, status, data_criacao) 
//              VALUES (?, ?, ?, ?, ?, 'ativo', NOW())`,
//             [nome, email, cpf, telefone || null, senhaHash]
//         );

//         const novoIdUsuario = resultado.insertId;

//         // Busca o ID do plano informado ou aplica o plano padrão (Degustação)
//         let idPlanoFinal = null;
//         if (plano) {
//             const [planoEncontrado] = await pool.query(
//                 "SELECT id_plano FROM Planos WHERE nome_plano LIKE ? LIMIT 1",
//                 [`%${plano}%`]
//             );
//             if (planoEncontrado.length > 0) idPlanoFinal = planoEncontrado[0].id_plano;
//         }

//         if (!idPlanoFinal) {
//             const [planoGratuito] = await pool.query(
//                 "SELECT id_plano FROM Planos WHERE nome_plano LIKE '%Degustação%' LIMIT 1"
//             );
//             if (planoGratuito.length > 0) idPlanoFinal = planoGratuito[0].id_plano;
//         }

//         if (idPlanoFinal) {
//             await pool.query(
//                 `INSERT INTO Assinaturas (id_usuario, id_plano, status, data_inicio) 
//                  VALUES (?, ?, 'Trial', NOW())`,
//                 [novoIdUsuario, idPlanoFinal]
//             );
//         }

//         return res.status(201).json({
//             message: "Usuário cadastrado com sucesso!",
//             id_usuario: novoIdUsuario
//         });

//     } catch (error) {
//         console.error("Erro no cadastro de usuário:", error);
//         return res.status(500).json({ error: "Erro interno no servidor ao realizar cadastro." });
//     }
// });

// // ROTA GET /perfil
// router.get("/perfil", autenticarToken, async (req, res) => {
//     try {
//         const idUsuario = req.usuario.id || req.usuario.id_usuario;

//         const [rows] = await pool.query(
//             `SELECT u.nome, u.email, p.nome_plano AS plano
//              FROM Usuarios u
//              LEFT JOIN Assinaturas a ON u.id_usuario = a.id_usuario
//              LEFT JOIN Planos p ON a.id_plano = p.id_plano
//              WHERE u.id_usuario = ? 
//              LIMIT 1`,
//             [idUsuario]
//         );

//         if (rows.length === 0) {
//             return res.status(404).json({ error: "Usuário não encontrado." });
//         }

//         const usuario = rows[0];

//         return res.status(200).json({
//             usuario: {
//                 nome: usuario.nome,
//                 username: "",
//                 email: usuario.email,
//                 foto: null,
//                 bio: "",
//                 plano: usuario.plano || "Essencial"
//             }
//         });
//     } catch (error) {
//         console.error("Erro na rota GET /perfil:", error);
//         return res.status(500).json({ error: "Erro interno no servidor ao buscar perfil." });
//     }
// });

// // ROTA PUT /perfil - Atualiza os dados do perfil e o plano do usuário
// router.put("/perfil", autenticarToken, async (req, res) => {
//     try {
//         const idUsuario = req.usuario.id || req.usuario.id_usuario;
//         const { foto, nome, username, email, bio, plano, novaSenha } = req.body;

//         // 1. Busca o id_plano correspondente ao nome do plano selecionado
//         let idPlano = null;
//         if (plano) {
//             const [planoRows] = await pool.query(
//                 "SELECT id_plano FROM Planos WHERE nome_plano LIKE ? LIMIT 1",
//                 [`%${plano}%`]
//             );
//             if (planoRows.length > 0) {
//                 idPlano = planoRows[0].id_plano;
//             }
//         }

//         // 2. Atualiza a assinatura na tabela Assinaturas
//         if (idPlano) {
//             await pool.query(
//                 `INSERT INTO Assinaturas (id_usuario, id_plano, status, data_inicio)
//                  VALUES (?, ?, 'Ativo', NOW())
//                  ON DUPLICATE KEY UPDATE id_plano = VALUES(id_plano)`,
//                 [idUsuario, idPlano]
//             );
//         }

//         // 3. Monta a query de atualização da tabela Usuarios
//         let campos = [
//             "foto = ?",
//             "nome = ?",
//             "username = ?",
//             "email = ?",
//             "bio = ?"
//         ];
//         let valores = [
//             foto || null,
//             nome,
//             username || null,
//             email,
//             bio || null
//         ];

//         if (novaSenha && novaSenha.trim() !== "") {
//             const senhaHash = await bcrypt.hash(novaSenha, 10);
//             campos.push("senha = ?");
//             valores.push(senhaHash);
//         }

//         valores.push(idUsuario);

//         const querySql = `UPDATE Usuarios SET ${campos.join(", ")} WHERE id_usuario = ?`;
//         await pool.query(querySql, valores);

//         return res.status(200).json({ message: "Perfil e plano atualizados com sucesso!" });

//     } catch (error) {
//         console.error("Erro na rota PUT /perfil:", error);

//         if (error.code === 'ER_DUP_ENTRY') {
//             return res.status(400).json({ error: "O username ou e-mail informado já está em uso." });
//         }

//         return res.status(500).json({ error: "Erro interno ao atualizar os dados do perfil." });
//     }
// });

// export default router;












// import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import pool from "../database/database.js";
// import loginController from "../controllers/loginController.js";
// import {enviarEmailToken}from "../config/mailer.js";

// const router = express.Router();

// // Middleware centralizado de autenticação JWT
// const autenticarToken = (req, res, next) => {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];

//     if (!token) {
//         return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
//     }

//     const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "sua_chave_secreta_aqui";

//     try {
//         req.usuario = jwt.verify(token, SECRET_KEY);
//         next();
//     } catch (err) {
//         console.error("🔥 Erro ao validar JWT no perfil:", err.message);
//         return res.status(403).json({ error: "Token inválido ou expirado." });
//     }
// };

// // ROTA DE LOGIN
// router.post("/login", loginController.login);

// // ROTA DE CADASTRO
// router.post("/cadastro", async (req, res) => {
//     try {
//         const { nome, email, cpf, telefone, senha, plano } = req.body;

//         if (!nome || !email || !cpf || !senha) {
//             return res.status(400).json({ error: "É necessário informar nome, e-mail, CPF e senha." });
//         }

//         const [usuarioExistente] = await pool.query(
//             "SELECT id_usuario FROM Usuarios WHERE email = ? OR cpf = ? LIMIT 1",
//             [email, cpf]
//         );

//         if (usuarioExistente.length > 0) {
//             return res.status(400).json({ error: "E-mail ou CPF já cadastrados no sistema." });
//         }

//         const saltRounds = 10;
//         const senhaHash = await bcrypt.hash(senha, saltRounds);

//         const [resultado] = await pool.query(
//             `INSERT INTO Usuarios (nome, email, cpf, telefone, senha, status, data_criacao) 
//              VALUES (?, ?, ?, ?, ?, 'ativo', NOW())`,
//             [nome, email, cpf, telefone || null, senhaHash]
//         );

//         const novoIdUsuario = resultado.insertId;

//         let idPlanoFinal = null;
//         if (plano) {
//             const [planoEncontrado] = await pool.query(
//                 "SELECT id_plano FROM Planos WHERE nome_plano LIKE ? LIMIT 1",
//                 [`%${plano}%`]
//             );
//             if (planoEncontrado.length > 0) idPlanoFinal = planoEncontrado[0].id_plano;
//         }

//         if (!idPlanoFinal) {
//             const [planoGratuito] = await pool.query(
//                 "SELECT id_plano FROM Planos WHERE nome_plano LIKE '%Degustação%' LIMIT 1"
//             );
//             if (planoGratuito.length > 0) idPlanoFinal = planoGratuito[0].id_plano;
//         }

//         if (idPlanoFinal) {
//             await pool.query(
//                 `INSERT INTO Assinaturas (id_usuario, id_plano, status, data_inicio) 
//                  VALUES (?, ?, 'Trial', NOW())`,
//                 [novoIdUsuario, idPlanoFinal]
//             );
//         }

        

//         // --- GERAÇÃO DO TOKEN DE PRIMEIRO ACESSO ---
//         const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "sua_chave_secreta_aqui";
//         const tokenPrimeiroAcesso = jwt.sign(
//             { id: novoIdUsuario, email: email, role: "user" },
//             SECRET_KEY,
//             { expiresIn: "1h" }
//         );

//         // --- ENVIO DO E-MAIL COM TOKEN ---
//         try {
//             await enviarEmailToken(email, nome, tokenPrimeiroAcesso);
//         } catch (emailError) {
//             console.error("🔥 Erro ao enviar e-mail com token:", emailError.message);
//         }

//         return res.status(201).json({
//             message: "Usuário cadastrado com sucesso! Verifique seu e-mail para receber o token.",
//             id_usuario: novoIdUsuario,
//             token: tokenPrimeiroAcesso
//         });

//     } catch (error) {
//         console.error("Erro no cadastro de usuário:", error);
//         return res.status(500).json({ error: "Erro interno no servidor ao realizar cadastro." });
//     }
// });

// // ROTA GET /perfil
// router.get("/perfil", autenticarToken, async (req, res) => {
//     try {
//         const idUsuario = req.usuario.id || req.usuario.id_usuario;
//         const emailUsuario = req.usuario.email;

//         const [rows] = await pool.query(
//             `SELECT u.nome, u.username, u.email, u.foto, u.bio, p.nome_plano AS plano
//              FROM Usuarios u
//              LEFT JOIN Assinaturas a ON u.id_usuario = a.id_usuario
//              LEFT JOIN Planos p ON a.id_plano = p.id_plano
//              WHERE u.id_usuario = ? OR u.email = ?
//              ORDER BY a.data_inicio DESC
//              LIMIT 1`,
//             [idUsuario || null, emailUsuario || null]
//         );

//         if (rows.length === 0) {
//             return res.status(404).json({ error: "Usuário não encontrado." });
//         }

//         const usuario = rows[0];

//         return res.status(200).json({
//             usuario: {
//                 nome: usuario.nome || "",
//                 username: usuario.username || "",
//                 email: usuario.email || "",
//                 foto: usuario.foto || null,
//                 bio: usuario.bio || "",
//                 plano: usuario.plano || "Essencial"
//             }
//         });
//     } catch (error) {
//         console.error("Erro na rota GET /perfil:", error);
//         return res.status(500).json({ error: "Erro interno no servidor ao buscar perfil." });
//     }
// });

// // ROTA PUT /perfil
// router.put("/perfil", autenticarToken, async (req, res) => {
//     try {
//         const idUsuario = req.usuario.id || req.usuario.id_usuario;
//         const emailUsuario = req.usuario.email;
//         const { foto, nome, username, email, bio, plano, novaSenha } = req.body;

//         let campos = [
//             "foto = ?",
//             "nome = ?",
//             "username = ?",
//             "email = ?",
//             "bio = ?"
//         ];
//         let valores = [
//             foto || null,
//             nome,
//             username || null,
//             email,
//             bio || null
//         ];

//         if (novaSenha && novaSenha.trim() !== "") {
//             const senhaHash = await bcrypt.hash(novaSenha, 10);
//             campos.push("senha = ?");
//             valores.push(senhaHash);
//         }

//         valores.push(idUsuario || null, emailUsuario || null);

//         const querySql = `UPDATE Usuarios SET ${campos.join(", ")} WHERE id_usuario = ? OR email = ?`;
//         await pool.query(querySql, valores);

//         if (plano) {
//             const idPlano = parseInt(plano, 10);

//             const [planoExiste] = await pool.query(
//                 "SELECT id_plano FROM Planos WHERE id_plano = ?",
//                 [idPlano]
//             );

//             if (planoExiste.length > 0) {
//                 const [userRows] = await pool.query("SELECT id_usuario FROM Usuarios WHERE email = ? OR id_usuario = ? LIMIT 1", [emailUsuario, idUsuario]);
//                 const idReal = userRows[0]?.id_usuario;

//                 const [assinaturaExiste] = await pool.query(
//                     "SELECT id_assinatura FROM Assinaturas WHERE id_usuario = ? ORDER BY id_assinatura DESC LIMIT 1",
//                     [idReal]
//                 );

//                 if (assinaturaExiste.length > 0) {
//                     await pool.query(
//                         `UPDATE Assinaturas SET id_plano = ?, status = 'Ativo' WHERE id_assinatura = ?`,
//                         [idPlano, assinaturaExiste[0].id_assinatura]
//                     );
//                 } else {
//                     await pool.query(
//                         `INSERT INTO Assinaturas (id_usuario, id_plano, status, data_inicio) VALUES (?, ?, 'Ativo', NOW())`,
//                         [idReal, idPlano]
//                     );
//                 }
//             }
//         }

//         return res.status(200).json({ message: "Perfil e plano atualizados com sucesso!" });

//     } catch (error) {
//         console.error("Erro na rota PUT /perfil:", error);

//         if (error.code === "ER_DUP_ENTRY") {
//             return res.status(400).json({ error: "O username ou e-mail informado já está em uso." });
//         }

//         return res.status(500).json({ error: "Erro interno ao atualizar os dados do perfil." });
//     }
// });

// export default router;








// import express from "express"; // Framework para criação do servidor e rotas
// import bcrypt from "bcrypt"; // Biblioteca para criptografar as senhas antes de salvar no banco
// import jwt from "jsonwebtoken"; // Biblioteca para geração e validação de tokens de segurança
// import pool from "../database/database.js"; // Conexão direta com o banco de dados MySQL
// import loginController from "../controllers/loginController.js"; // Controller que gerencia a lógica de login
// import { enviarEmailToken } from "../config/mailer.js"; // Função utilitária que dispara o e-mail via Nodemailer

// const router = express.Router(); // Cria um roteador para agrupar estas rotas específicas

// // =========================================================
// // MIDDLEWARE DE AUTENTICAÇÃO
// // Função que barra requisições se o usuário não tiver um Token válido
// // =========================================================
// const autenticarToken = (req, res, next) => {
//     // Busca o cabeçalho Authorization enviado pelo frontend
//     const authHeader = req.headers["authorization"];
//     // Extrai apenas o código JWT, descartando a palavra "Bearer "
//     const token = authHeader && authHeader.split(" ")[1];

//     if (!token) {
//         return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
//     }

//     // Busca a chave secreta no arquivo .env
//     const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "sua_chave_secreta_aqui";

//     try {
//         // Tenta abrir o token. Se a chave estiver errada ou o tempo expirou, isso vai gerar um erro
//         req.usuario = jwt.verify(token, SECRET_KEY); 
//         next(); // Token válido! Libera a execução para continuar até a rota final (ex: GET /perfil)
//     } catch (err) {
//         console.error("🔥 Erro ao validar JWT no perfil:", err.message);
//         return res.status(403).json({ error: "Token inválido ou expirado." });
//     }
// };

// // =========================================================
// // ROTA DE LOGIN
// // =========================================================
// // Encaminha a requisição POST /login para a função externa 'loginController.login'
// router.post("/login", loginController.login);

// // =========================================================
// // ROTA DE CADASTRO
// // Cria um novo usuário no banco de dados e envia e-mail de ativação
// // =========================================================
// router.post("/cadastro", async (req, res) => {
//     try {
//         // 1. Puxa os dados que o usuário preencheu no formulário do frontend
//         const { nome, email, cpf, telefone, senha, plano } = req.body;

//         // 2. Trava o cadastro se campos obrigatórios estiverem vazios
//         if (!nome || !email || !cpf || !senha) {
//             return res.status(400).json({ error: "É necessário informar nome, e-mail, CPF e senha." });
//         }

//         // 3. Verifica no banco se esse CPF ou E-mail já existe para evitar duplicidade
//         const [usuarioExistente] = await pool.query(
//             "SELECT id_usuario FROM Usuarios WHERE email = ? OR cpf = ? LIMIT 1",
//             [email, cpf]
//         );

//         if (usuarioExistente.length > 0) {
//             return res.status(400).json({ error: "E-mail ou CPF já cadastrados no sistema." });
//         }

//         // 4. Transforma a senha em texto puro ("1234") em um código criptografado irreversível
//         const saltRounds = 10;
//         const senhaHash = await bcrypt.hash(senha, saltRounds);

//         // 5. Salva o usuário no banco com o status inicial 'pendente' (ele ainda não clicou no e-mail)
//         const [resultado] = await pool.query(
//             `INSERT INTO Usuarios (nome, email, cpf, telefone, senha, status, data_criacao) 
//              VALUES (?, ?, ?, ?, ?, 'pendente', NOW())`,
//             [nome, email, cpf, telefone || null, senhaHash]
//         );

//         // Pega o ID (número) do usuário que acabou de ser criado no banco
//         const novoIdUsuario = resultado.insertId;

//         // 6. LÓGICA DO PLANO DE ASSINATURA
//         let idPlanoFinal = null;
//         if (plano) {
//             // Se o frontend enviou um plano, busca o ID dele no banco de dados
//             const [planoEncontrado] = await pool.query(
//                 "SELECT id_plano FROM Planos WHERE nome_plano LIKE ? LIMIT 1",
//                 [`%${plano}%`]
//             );
//             if (planoEncontrado.length > 0) idPlanoFinal = planoEncontrado[0].id_plano;
//         }

//         // Se nenhum plano foi escolhido, vincula o usuário ao plano "Degustação" (gratuito)
//         if (!idPlanoFinal) {
//            const [planoGratuito] = await pool.query(
//     "SELECT id_plano FROM Planos WHERE nome_plano LIKE '%Degustação%' LIMIT 1"
// );
//             if (planoGratuito.length > 0) idPlanoFinal = planoGratuito[0].id_plano;
//         }

//         // Registra a assinatura do plano escolhido/default na tabela 'Assinaturas' com status 'Trial'
//     // Registra a assinatura do plano apenas se um ID válido for localizado
// if (idPlanoFinal) {
//     try {
//         await pool.query(
//             `INSERT INTO Assinaturas (id_usuario, id_plano, status, data_inicio) 
//              VALUES (?, ?, 'Trial', NOW())`,
//             [novoIdUsuario, idPlanoFinal]
//         );
//     } catch (planoError) {
//         console.warn("⚠️ Não foi possível vincular o plano ao usuário:", planoError.message);
//     }
// }

//         // 7. GERAÇÃO DO TOKEN
//         // Cria um Token JWT de primeiro acesso exclusivo para este e-mail. Ele expira em 1 hora.
//         const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "sua_chave_secreta_aqui";
//         const tokenPrimeiroAcesso = jwt.sign(
//             { id: novoIdUsuario, email: email, role: "user" },
//             SECRET_KEY,
//             { expiresIn: "1h" }
//         );

//         // 8. Envia o e-mail chamando a função externa que usa o Nodemailer
//         try {
//             await enviarEmailToken(email, nome, tokenPrimeiroAcesso);
//         } catch (emailError) {
//             console.error("🔥 Erro ao enviar e-mail com token:", emailError.message);
//             // Nota: O erro de e-mail é ignorado para o usuário não perder o cadastro, apenas exibe no log
//         }

//         // Responde ao frontend dizendo que deu certo
//         return res.status(201).json({
//             message: "Usuário cadastrado com sucesso! Verifique seu e-mail para confirmar a conta.",
//             id_usuario: novoIdUsuario,
//             token: tokenPrimeiroAcesso
//         });

//     } catch (error) {
//         console.error("Erro no cadastro de usuário:", error);
//         return res.status(500).json({ error: "Erro interno no servidor ao realizar cadastro." });
//     }
// });

// // =========================================================
// // ROTA DE CONFIRMAÇÃO DE E-MAIL
// // Rota chamada quando o usuário clica no link enviado para o e-mail dele
// // =========================================================
// router.post("/confirmar-email", async (req, res) => {
//     try {
//         const { token } = req.body; // Pega o token enviado pelo frontend

//         if (!token) {
//             return res.status(400).json({ sucesso: false, mensagem: "Token de verificação não fornecido." });
//         }

//         const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "sua_chave_secreta_aqui";
        
//         // 1. Tenta decodificar o token. Se já passou de 1 hora, essa função dará erro e cairá no catch()
//         const decodificado = jwt.verify(token, SECRET_KEY);
//         const idUsuario = decodificado.id;

//         // 2. Se o token for válido, altera o status do usuário de 'pendente' para 'ativo' no banco de dados
//         await pool.query(
//             "UPDATE Usuarios SET status = 'ativo' WHERE id_usuario = ?",
//             [idUsuario]
//         );

//         return res.status(200).json({
//             sucesso: true,
//             mensagem: "E-mail verificado com sucesso! Sua conta está ativa."
//         });

//     } catch (error) {
//         console.error("Erro na confirmação de e-mail:", error.message);
//         return res.status(400).json({
//             sucesso: false,
//             mensagem: "Token inválido ou expirado. Solicite um novo envio."
//         });
//     }
// });

// // =========================================================
// // ROTA GET /perfil (BUSCAR DADOS)
// // 'autenticarToken' obriga o usuário a estar logado para acessar esta rota
// // =========================================================
// router.get("/perfil", autenticarToken, async (req, res) => {
//     try {
//         // Como o middleware autenticou o usuário, ele injetou req.usuario. Pegamos o ID e e-mail por aqui
//         const idUsuario = req.usuario.id || req.usuario.id_usuario;
//         const emailUsuario = req.usuario.email;

//         // Busca todas as informações do usuário e faz um JOIN (mescla) para trazer também o nome do Plano de Assinatura
//         const [rows] = await pool.query(
//             `SELECT u.nome, u.username, u.email, u.foto, u.bio, p.nome_plano AS plano
//              FROM Usuarios u
//              LEFT JOIN Assinaturas a ON u.id_usuario = a.id_usuario
//              LEFT JOIN Planos p ON a.id_plano = p.id_plano
//              WHERE u.id_usuario = ? OR u.email = ?
//              ORDER BY a.data_inicio DESC
//              LIMIT 1`,
//             [idUsuario || null, emailUsuario || null]
//         );

//         if (rows.length === 0) {
//             return res.status(404).json({ error: "Usuário não encontrado." });
//         }

//         const usuario = rows[0];

//         // Devolve os dados bonitinhos e formatados para o Frontend desenhar a tela
//         return res.status(200).json({
//             usuario: {
//                 nome: usuario.nome || "",
//                 username: usuario.username || "",
//                 email: usuario.email || "",
//                 foto: usuario.foto || null,
//                 bio: usuario.bio || "",
//                 plano: usuario.plano || "Essencial"
//             }
//         });
//     } catch (error) {
//         console.error("Erro na rota GET /perfil:", error);
//         return res.status(500).json({ error: "Erro interno no servidor ao buscar perfil." });
//     }
// });

// // =========================================================
// // ROTA PUT /perfil (ATUALIZAR DADOS)
// // 'autenticarToken' garante que o usuário só consiga atualizar o PRÓPRIO perfil
// // =========================================================
// router.put("/perfil", autenticarToken, async (req, res) => {
//     try {
//         const idUsuario = req.usuario.id || req.usuario.id_usuario;
//         const emailUsuario = req.usuario.email;
        
//         // Pega todos os campos novos digitados pelo usuário na tela de edição do frontend
//         const { foto, nome, username, email, bio, plano, novaSenha } = req.body;

//         // Prepara os arrays que vão formar a string SQL da atualização (UPDATE)
//         let campos = [
//             "foto = ?", "nome = ?", "username = ?", "email = ?", "bio = ?"
//         ];
//         let valores = [
//             foto || null, nome, username || null, email, bio || null
//         ];

//         // Se ele digitou uma senha nova, nós a criptografamos e adicionamos aos dados que serão atualizados
//         if (novaSenha && novaSenha.trim() !== "") {
//             const senhaHash = await bcrypt.hash(novaSenha, 10);
//             campos.push("senha = ?");
//             valores.push(senhaHash);
//         }

//         // Adiciona o ID no final do array de valores para preencher o WHERE do banco
//         valores.push(idUsuario || null, emailUsuario || null);

//         // Monta a string final: "UPDATE Usuarios SET foto = ?, nome = ? ... WHERE id_usuario = ?"
//         const querySql = `UPDATE Usuarios SET ${campos.join(", ")} WHERE id_usuario = ? OR email = ?`;
//         await pool.query(querySql, valores); // Executa no banco de dados

//         // LÓGICA DE UPGRADE DE PLANO PELA TELA DE PERFIL
//         if (plano) {
//             const idPlano = parseInt(plano, 10);

//             // Verifica se o plano enviado existe no banco
//             const [planoExiste] = await pool.query(
//                 "SELECT id_plano FROM Planos WHERE id_plano = ?",
//                 [idPlano]
//             );

//             if (planoExiste.length > 0) {
//                 // Recupera o ID real do usuário caso haja divergência do Token
//                 const [userRows] = await pool.query("SELECT id_usuario FROM Usuarios WHERE email = ? OR id_usuario = ? LIMIT 1", [emailUsuario, idUsuario]);
//                 const idReal = userRows[0]?.id_usuario;

//                 // Verifica se ele já possui uma assinatura cadastrada
//                 const [assinaturaExiste] = await pool.query(
//                     "SELECT id_assinatura FROM Assinaturas WHERE id_usuario = ? ORDER BY id_assinatura DESC LIMIT 1",
//                     [idReal]
//                 );

//                 if (assinaturaExiste.length > 0) {
//                     // Se já tiver assinatura, faz um UPDATE (atualiza para o novo plano)
//                     await pool.query(
//                         `UPDATE Assinaturas SET id_plano = ?, status = 'Ativo' WHERE id_assinatura = ?`,
//                         [idPlano, assinaturaExiste[0].id_assinatura]
//                     );
//                 } else {
//                     // Se não tiver assinatura, faz um INSERT (cria uma assinatura nova)
//                     await pool.query(
//                         `INSERT INTO Assinaturas (id_usuario, id_plano, status, data_inicio) VALUES (?, ?, 'Ativo', NOW())`,
//                         [idReal, idPlano]
//                     );
//                 }
//             }
//         }

//         return res.status(200).json({ message: "Perfil e plano atualizados com sucesso!" });

//     } catch (error) {
//         console.error("Erro na rota PUT /perfil:", error);

//         // O erro ER_DUP_ENTRY é retornado pelo MySQL quando você tenta usar um email/username que já pertence a outra pessoa
//         if (error.code === "ER_DUP_ENTRY") {
//             return res.status(400).json({ error: "O username ou e-mail informado já está em uso." });
//         }

//         return res.status(500).json({ error: "Erro interno ao atualizar os dados do perfil." });
//     }
// });

// export default router;




// import express from "express"; // Framework para criação do servidor e rotas
// import bcrypt from "bcrypt"; // Biblioteca para criptografar as senhas antes de salvar no banco
// import jwt from "jsonwebtoken"; // Biblioteca para geração e validação de tokens de segurança
// import multer from "multer"; // Biblioteca para manusear upload de arquivos multipart/form-data
// import path from "path";
// import fs from "fs";
// import pool from "../database/database.js"; // Conexão direta com o banco de dados MySQL
// import loginController from "../controllers/loginController.js"; // Controller que gerencia a lógica de login
// import { enviarEmailToken } from "../config/mailer.js"; // Função utilitária que dispara o e-mail via Nodemailer

// const router = express.Router(); // Cria um roteador para agrupar estas rotas específicas

// // =========================================================
// // CONFIGURAÇÃO DO UPLOAD DE FOTOS (MULTER)
// // =========================================================
// const pastaFotos = path.resolve("fotos_usuarios");

// // Cria a pasta automaticamente caso ela não exista no projeto
// if (!fs.existsSync(pastaFotos)) {
//     fs.mkdirSync(pastaFotos, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, pastaFotos);
//     },
//     filename: (req, file, cb) => {
//         // Gera um nome único para o arquivo evitando sobreposição
//         const ext = path.extname(file.originalname);
//         const idUsuario = req.usuario?.id || req.usuario?.id_usuario || Date.now();
//         cb(null, `foto_${idUsuario}_${Date.now()}${ext}`);
//     }
// });

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB por foto
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith("image/")) {
//             cb(null, true);
//         } else {
//             cb(new Error("Apenas arquivos de imagem são permitidos!"));
//         }
//     }
// });

// // =========================================================
// // MIDDLEWARE DE AUTENTICAÇÃO
// // =========================================================
// const autenticarToken = (req, res, next) => {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];

//     if (!token) {
//         return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
//     }

//     const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "sua_chave_secreta_aqui";

//     try {
//         req.usuario = jwt.verify(token, SECRET_KEY);
//         next();
//     } catch (err) {
//         console.error("🔥 Erro ao validar JWT no perfil:", err.message);
//         return res.status(403).json({ error: "Token inválido ou expirado." });
//     }
// };

// // =========================================================
// // ROTA DE LOGIN
// // =========================================================
// router.post("/login", loginController.login);

// // =========================================================
// // ROTA DE CADASTRO (COM TRATAMENTO DE ERROS REFORÇADO)
// // =========================================================
// router.post("/cadastro", async (req, res) => {
//     try {
//         const { nome, email, cpf, telefone, senha, plano, formaPagamento, paymentIntentId } = req.body;

//         if (!nome || !email || !cpf || !senha) {
//             return res.status(400).json({ error: "É necessário informar nome, e-mail, CPF e senha." });
//         }

//         const [usuarioExistente] = await pool.query(
//             "SELECT id_usuario FROM Usuarios WHERE email = ? OR cpf = ? LIMIT 1",
//             [email, cpf]
//         );

//         if (usuarioExistente.length > 0) {
//             return res.status(400).json({ error: "E-mail ou CPF já cadastrados no sistema." });
//         }

//         const saltRounds = 10;
//         const senhaHash = await bcrypt.hash(senha, saltRounds);

//         const [resultado] = await pool.query(
//             `INSERT INTO Usuarios (nome, email, cpf, telefone, senha, status, data_criacao) 
//              VALUES (?, ?, ?, ?, ?, 'pendente', NOW())`,
//             [nome, email, cpf, telefone || null, senhaHash]
//         );

//         const novoIdUsuario = resultado.insertId;

//         // ---------------------------------------------------------
//         // BUSCA DO PLANO
//         // ---------------------------------------------------------
//         let idPlanoFinal = null;
//         let nomePlanoLimpo = plano ? plano.split('-')[1] || plano : '';

//         if (nomePlanoLimpo) {
//             const [planoEncontrado] = await pool.query(
//                 "SELECT id_plano FROM Planos WHERE nome_plano LIKE ? LIMIT 1",
//                 [`%${nomePlanoLimpo.trim()}%`]
//             );
//             if (planoEncontrado.length > 0) idPlanoFinal = planoEncontrado[0].id_plano;
//         }

//         // Se não encontrou o plano informado, pega o primeiro plano cadastrado na tabela
//         if (!idPlanoFinal) {
//             const [primeiroPlano] = await pool.query("SELECT id_plano FROM Planos LIMIT 1");
//             if (primeiroPlano.length > 0) idPlanoFinal = primeiroPlano[0].id_plano;
//         }

//         // ---------------------------------------------------------
//         // MAPEAMENTO DO ENUM DE PAGAMENTO
//         // ---------------------------------------------------------
//         let formaPagamentoEnum = 'Pix';
//         if (formaPagamento && (formaPagamento.includes('Crédito') || formaPagamento.includes('Credito'))) {
//             formaPagamentoEnum = 'Cartao_Credito';
//         } else if (formaPagamento && (formaPagamento.includes('Débito') || formaPagamento.includes('Debito'))) {
//             formaPagamentoEnum = 'Cartao_Debito';
//         }

//         // ---------------------------------------------------------
//         // INSERÇÃO DA ASSINATURA
//         // ---------------------------------------------------------
//         if (idPlanoFinal) {
//             try {
//                 await pool.query(
//                     `INSERT INTO Assinaturas (
//                         id_usuario, 
//                         id_plano, 
//                         forma_pagamento, 
//                         status, 
//                         stripe_payment_id,
//                         data_inicio,
//                         proxima_cobranca
//                     ) VALUES (?, ?, ?, 'Ativa', ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH))`,
//                     [
//                         novoIdUsuario, 
//                         idPlanoFinal, 
//                         formaPagamentoEnum, 
//                         paymentIntentId || null
//                     ]
//                 );
//             } catch (planoError) {
//                 console.error("🔥 Erro ao inserir Assinatura:", planoError);
//             }
//         }

//         // ---------------------------------------------------------
//         // GERAR TOKEN E ENVIAR E-MAIL
//         // ---------------------------------------------------------
//         const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "sua_chave_secreta_aqui";
//         const tokenPrimeiroAcesso = jwt.sign(
//             { id: novoIdUsuario, email: email, role: "user" },
//             SECRET_KEY,
//             { expiresIn: "1h" }
//         );

//         try {
//             await enviarEmailToken(email, nome, tokenPrimeiroAcesso);
//         } catch (emailError) {
//             console.error("🔥 Erro ao enviar e-mail com token:", emailError.message);
//         }

//         return res.status(201).json({
//             message: "Usuário cadastrado com sucesso! Verifique seu e-mail para confirmar a conta.",
//             id_usuario: novoIdUsuario,
//             token: tokenPrimeiroAcesso
//         });

//     } catch (error) {
//         console.error("Erro interno no cadastro de usuário:", error);
//         return res.status(500).json({ error: "Erro interno no servidor ao realizar cadastro." });
//     }
// });

// // =========================================================
// // ROTA DE CONFIRMAÇÃO DE E-MAIL
// // =========================================================
// router.post("/confirmar-email", async (req, res) => {
//     try {
//         const { token } = req.body;

//         if (!token) {
//             return res.status(400).json({ sucesso: false, mensagem: "Token de verificação não fornecido." });
//         }

//         const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "sua_chave_secreta_aqui";
//         const decodificado = jwt.verify(token, SECRET_KEY);
//         const idUsuario = decodificado.id;

//         await pool.query(
//             "UPDATE Usuarios SET status = 'ativo' WHERE id_usuario = ?",
//             [idUsuario]
//         );

//         return res.status(200).json({
//             sucesso: true,
//             mensagem: "E-mail verificado com sucesso! Sua conta está ativa."
//         });

//     } catch (error) {
//         console.error("Erro na confirmação de e-mail:", error.message);
//         return res.status(400).json({
//             sucesso: false,
//             mensagem: "Token inválido ou expirado. Solicite um novo envio."
//         });
//     }
// });

// // =========================================================
// // ROTA GET /perfil (BUSCAR DADOS)
// // =========================================================
// router.get("/perfil", autenticarToken, async (req, res) => {
//     try {
//         const idUsuario = req.usuario.id || req.usuario.id_usuario;
//         const emailUsuario = req.usuario.email;

//         const [rows] = await pool.query(
//             `SELECT u.nome, u.username, u.email, u.foto, u.bio, p.nome_plano AS plano
//              FROM Usuarios u
//              LEFT JOIN Assinaturas a ON u.id_usuario = a.id_usuario
//              LEFT JOIN Planos p ON a.id_plano = p.id_plano
//              WHERE u.id_usuario = ? OR u.email = ?
//              ORDER BY a.data_inicio DESC
//              LIMIT 1`,
//             [idUsuario || null, emailUsuario || null]
//         );

//         if (rows.length === 0) {
//             return res.status(404).json({ error: "Usuário não encontrado." });
//         }

//         const usuario = rows[0];

//         return res.status(200).json({
//             usuario: {
//                 nome: usuario.nome || "",
//                 username: usuario.username || "",
//                 email: usuario.email || "",
//                 foto: usuario.foto || null,
//                 bio: usuario.bio || "",
//                 plano: usuario.plano || "Essencial"
//             }
//         });
//     } catch (error) {
//         console.error("Erro na rota GET /perfil:", error);
//         return res.status(500).json({ error: "Erro interno no servidor ao buscar perfil." });
//     }
// });

// // =========================================================
// // ROTA PUT /perfil (ATUALIZAR DADOS E FOTO)
// // =========================================================
// // Adicionado middleware upload.single('foto') para processar o envio da foto do perfil
// router.put("/perfil", autenticarToken, upload.single("foto"), async (req, res) => {
//     try {
//         const idUsuario = req.usuario.id || req.usuario.id_usuario;
//         const emailUsuario = req.usuario.email;

//         const { nome, username, email, bio, plano, novaSenha } = req.body;

//         // Se um novo arquivo de imagem foi enviado pelo formulário:
//         let caminhoFotoBanco = null;
//         if (req.file) {
//             caminhoFotoBanco = `/fotos_usuarios/${req.file.filename}`;
//         }

//         // Montagem dinâmica dos campos para o UPDATE
//         let campos = ["nome = ?", "username = ?", "email = ?", "bio = ?"];
//         let valores = [nome, username || null, email, bio || null];

//         // Atualiza o caminho da foto no banco caso um novo arquivo tenha sido enviado
//         if (caminhoFotoBanco) {
//             campos.push("foto = ?");
//             valores.push(caminhoFotoBanco);
//         }

//         if (novaSenha && novaSenha.trim() !== "") {
//             const senhaHash = await bcrypt.hash(novaSenha, 10);
//             campos.push("senha = ?");
//             valores.push(senhaHash);
//         }

//         valores.push(idUsuario || null, emailUsuario || null);

//         const querySql = `UPDATE Usuarios SET ${campos.join(", ")} WHERE id_usuario = ? OR email = ?`;
//         await pool.query(querySql, valores);

//         // Atualização de Plano
//         if (plano) {
//             const idPlano = parseInt(plano, 10);

//             const [planoExiste] = await pool.query(
//                 "SELECT id_plano FROM Planos WHERE id_plano = ?",
//                 [idPlano]
//             );

//             if (planoExiste.length > 0) {
//                 const [userRows] = await pool.query("SELECT id_usuario FROM Usuarios WHERE email = ? OR id_usuario = ? LIMIT 1", [emailUsuario, idUsuario]);
//                 const idReal = userRows[0]?.id_usuario;

//                 const [assinaturaExiste] = await pool.query(
//                     "SELECT id_assinatura FROM Assinaturas WHERE id_usuario = ? ORDER BY id_assinatura DESC LIMIT 1",
//                     [idReal]
//                 );

//                 if (assinaturaExiste.length > 0) {
//                     await pool.query(
//                         `UPDATE Assinaturas SET id_plano = ?, status = 'Ativo' WHERE id_assinatura = ?`,
//                         [idPlano, assinaturaExiste[0].id_assinatura]
//                     );
//                 } else {
//                     await pool.query(
//                         `INSERT INTO Assinaturas (id_usuario, id_plano, status, data_inicio) VALUES (?, ?, 'Ativo', NOW())`,
//                         [idReal, idPlano]
//                     );
//                 }
//             }
//         }

//         return res.status(200).json({ 
//             message: "Perfil e plano atualizados com sucesso!",
//             foto: caminhoFotoBanco 
//         });

//     } catch (error) {
//         console.error("Erro na rota PUT /perfil:", error);

//         if (error.code === "ER_DUP_ENTRY") {
//             return res.status(400).json({ error: "O username ou e-mail informado já está em uso." });
//         }

//         return res.status(500).json({ error: "Erro interno ao atualizar os dados do perfil." });
//     }
// });

// export default router;





import express from "express"; // Framework para criação do servidor e rotas
import bcrypt from "bcrypt"; // Biblioteca para criptografar as senhas antes de salvar no banco
import jwt from "jsonwebtoken"; // Biblioteca para geração e validação de tokens de segurança
import multer from "multer"; // Biblioteca para manusear upload de arquivos multipart/form-data
import path from "path";
import fs from "fs";
import Stripe from "stripe"; // IMPORTAÇÃO DO STRIPE
import pool from "../database/database.js"; // Conexão direta com o banco de dados MySQL
import loginController from "../controllers/loginController.js"; // Controller que gerencia a lógica de login
import { enviarEmailToken } from "../config/mailer.js"; // Função utilitária que dispara o e-mail via Nodemailer

const router = express.Router(); // Cria um roteador para agrupar estas rotas específicas

// Inicializa o Stripe usando a chave secreta do arquivo .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_sua_chave_secreta_aqui');

// =========================================================
// CONFIGURAÇÃO DO UPLOAD DE FOTOS (MULTER)
// =========================================================
const pastaFotos = path.resolve("fotos_usuarios");

// Cria a pasta automaticamente caso ela não exista no projeto
if (!fs.existsSync(pastaFotos)) {
    fs.mkdirSync(pastaFotos, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pastaFotos);
    },
    filename: (req, file, cb) => {
        // Gera um nome único para o arquivo evitando sobreposição
        const ext = path.extname(file.originalname);
        const idUsuario = req.usuario?.id || req.usuario?.id_usuario || Date.now();
        cb(null, `foto_${idUsuario}_${Date.now()}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB por foto
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Apenas arquivos de imagem são permitidos!"));
        }
    }
});

// =========================================================
// MIDDLEWARE DE AUTENTICAÇÃO
// =========================================================
const autenticarToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    }

    const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "sua_chave_secreta_aqui";

    try {
        req.usuario = jwt.verify(token, SECRET_KEY);
        next();
    } catch (err) {
        console.error("🔥 Erro ao validar JWT no perfil:", err.message);
        return res.status(403).json({ error: "Token inválido ou expirado." });
    }
};

// =========================================================
// ROTAS DE PAGAMENTO DA STRIPE
// =========================================================

// Rota para pagamento com Cartão (Ex: POST /api/clientes/criar-pagamento-cartao)
router.post("/clientes/criar-pagamento-cartao", async (req, res) => {
    try {
        const { valor } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: valor || 499,
            currency: "brl",
            payment_method_types: ["card"],
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Erro no pagamento por cartão:", error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para pagamento com Pix (Ex: POST /api/clientes/criar-pagamento-pix)
router.post("/clientes/criar-pagamento-pix", async (req, res) => {
    try {
        const { valor } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: valor || 499,
            currency: "brl",
            payment_method_types: ["pix"],
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Erro no pagamento por Pix:", error);
        res.status(500).json({ error: error.message });
    }
});

// =========================================================
// ROTA DE LOGIN
// =========================================================
router.post("/login", loginController.login);

// =========================================================
// ROTA DE CADASTRO
// =========================================================
router.post("/cadastro", async (req, res) => {
    try {
        const { nome, email, cpf, telefone, senha, plano, formaPagamento, paymentIntentId } = req.body;

        if (!nome || !email || !cpf || !senha) {
            return res.status(400).json({ error: "É necessário informar nome, e-mail, CPF e senha." });
        }

        const [usuarioExistente] = await pool.query(
            "SELECT id_usuario FROM Usuarios WHERE email = ? OR cpf = ? LIMIT 1",
            [email, cpf]
        );

        if (usuarioExistente.length > 0) {
            return res.status(400).json({ error: "E-mail ou CPF já cadastrados no sistema." });
        }

        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(senha, saltRounds);

        const [resultado] = await pool.query(
            `INSERT INTO Usuarios (nome, email, cpf, telefone, senha, status, data_criacao) 
             VALUES (?, ?, ?, ?, ?, 'pendente', NOW())`,
            [nome, email, cpf, telefone || null, senhaHash]
        );

        const novoIdUsuario = resultado.insertId;

        // ---------------------------------------------------------
        // BUSCA DO PLANO
        // ---------------------------------------------------------
        let idPlanoFinal = null;
        let nomePlanoLimpo = plano ? plano.split('-')[1] || plano : '';

        if (nomePlanoLimpo) {
            const [planoEncontrado] = await pool.query(
                "SELECT id_plano FROM Planos WHERE nome_plano LIKE ? LIMIT 1",
                [`%${nomePlanoLimpo.trim()}%`]
            );
            if (planoEncontrado.length > 0) idPlanoFinal = planoEncontrado[0].id_plano;
        }

        if (!idPlanoFinal) {
            const [primeiroPlano] = await pool.query("SELECT id_plano FROM Planos LIMIT 1");
            if (primeiroPlano.length > 0) idPlanoFinal = primeiroPlano[0].id_plano;
        }

        // ---------------------------------------------------------
        // MAPEAMENTO DO ENUM DE PAGAMENTO
        // ---------------------------------------------------------
        let formaPagamentoEnum = 'Pix';
        if (formaPagamento && (formaPagamento.includes('Crédito') || formaPagamento.includes('Credito'))) {
            formaPagamentoEnum = 'Cartao_Credito';
        } else if (formaPagamento && (formaPagamento.includes('Débito') || formaPagamento.includes('Debito'))) {
            formaPagamentoEnum = 'Cartao_Debito';
        }

       // ---------------------------------------------------------
        // INSERÇÃO DA ASSINATURA (CORRIGIDO: status 'Ativo')
        // ---------------------------------------------------------
        if (idPlanoFinal) {
            try {
                await pool.query(
                    `INSERT INTO Assinaturas (
                        id_usuario, 
                        id_plano, 
                        forma_pagamento, 
                        status, 
                        stripe_payment_id,
                        data_inicio,
                        proxima_cobranca
                    ) VALUES (?, ?, ?, 'Ativo', ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH))`,
                    [
                        novoIdUsuario, 
                        idPlanoFinal, 
                        formaPagamentoEnum, 
                        paymentIntentId || null
                    ]
                );
            } catch (planoError) {
                console.error("🔥 Erro ao inserir Assinatura:", planoError);
            }
        }
        // ---------------------------------------------------------
        // GERAR TOKEN E ENVIAR E-MAIL
        // ---------------------------------------------------------
      const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "sua_chave_secreta_aqui";
        const tokenPrimeiroAcesso = jwt.sign(
            { id: novoIdUsuario, id_usuario: novoIdUsuario, email: email, role: "user" },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        try {
            await enviarEmailToken(email, nome, tokenPrimeiroAcesso);
        } catch (emailError) {
            console.error("🔥 Erro ao enviar e-mail com token:", emailError.message);
        }

        return res.status(201).json({
            message: "Usuário cadastrado com sucesso! Verifique seu e-mail para confirmar a conta.",
            id_usuario: novoIdUsuario,
            token: tokenPrimeiroAcesso
        });

    } catch (error) {
        console.error("Erro interno no cadastro de usuário:", error);
        return res.status(500).json({ error: "Erro interno no servidor ao realizar cadastro." });
    }
});

// =========================================================
// ROTA DE CONFIRMAÇÃO DE E-MAIL
// =========================================================
router.post("/confirmar-email", async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ sucesso: false, mensagem: "Token de verificação não fornecido." });
        }

        const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "sua_chave_secreta_aqui";
        const decodificado = jwt.verify(token, SECRET_KEY);
        const idUsuario = decodificado.id;

        await pool.query(
            "UPDATE Usuarios SET status = 'ativo' WHERE id_usuario = ?",
            [idUsuario]
        );

        return res.status(200).json({
            sucesso: true,
            mensagem: "E-mail verificado com sucesso! Sua conta está ativa."
        });

    } catch (error) {
        console.error("Erro na confirmação de e-mail:", error.message);
        return res.status(400).json({
            sucesso: false,
            mensagem: "Token inválido ou expirado. Solicite um novo envio."
        });
    }
});
// =========================================================
// ROTA GET /perfil (BUSCAR DADOS - ATUALIZADA)
// =========================================================
router.get("/perfil", autenticarToken, async (req, res) => {
    try {
        const idUsuario = req.usuario.id || req.usuario.id_usuario;
        const emailUsuario = req.usuario.email;

        const [rows] = await pool.query(
            `SELECT u.id_usuario, u.nome, u.username, u.email, u.foto, u.bio, p.nome_plano AS plano, a.id_plano
             FROM Usuarios u
             LEFT JOIN Assinaturas a ON u.id_usuario = a.id_usuario
             LEFT JOIN Planos p ON a.id_plano = p.id_plano
             WHERE u.id_usuario = ? OR u.email = ?
             ORDER BY a.data_inicio DESC
             LIMIT 1`,
            [idUsuario || null, emailUsuario || null]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        const usuario = rows[0];

        return res.status(200).json({
            usuario: {
                id_usuario: usuario.id_usuario,
                nome: usuario.nome || "",
                username: usuario.username || "",
                email: usuario.email || "",
                foto: usuario.foto || null,
                bio: usuario.bio || "",
                plano: usuario.plano || "Essencial",
                id_plano: usuario.id_plano || 1
            }
        });
    } catch (error) {
        console.error("Erro na rota GET /perfil:", error);
        return res.status(500).json({ error: "Erro interno no servidor ao buscar perfil." });
    }
});

// =========================================================
// ROTA PUT /perfil (ATUALIZAR DADOS E FOTO)
// =========================================================
router.put("/perfil", autenticarToken, upload.single("foto"), async (req, res) => {
    try {
        const idUsuario = req.usuario.id || req.usuario.id_usuario;
        const emailUsuario = req.usuario.email;

        const { nome, username, email, bio, plano, novaSenha } = req.body;

        let caminhoFotoBanco = null;
        if (req.file) {
            caminhoFotoBanco = `/fotos_usuarios/${req.file.filename}`;
        }

        let campos = ["nome = ?", "username = ?", "email = ?", "bio = ?"];
        let valores = [nome, username || null, email, bio || null];

        if (caminhoFotoBanco) {
            campos.push("foto = ?");
            valores.push(caminhoFotoBanco);
        }

        if (novaSenha && novaSenha.trim() !== "") {
            const senhaHash = await bcrypt.hash(novaSenha, 10);
            campos.push("senha = ?");
            valores.push(senhaHash);
        }

        valores.push(idUsuario || null, emailUsuario || null);

        const querySql = `UPDATE Usuarios SET ${campos.join(", ")} WHERE id_usuario = ? OR email = ?`;
        await pool.query(querySql, valores);

        if (plano) {
            const idPlano = parseInt(plano, 10);

            const [planoExiste] = await pool.query(
                "SELECT id_plano FROM Planos WHERE id_plano = ?",
                [idPlano]
            );

            if (planoExiste.length > 0) {
                const [userRows] = await pool.query("SELECT id_usuario FROM Usuarios WHERE email = ? OR id_usuario = ? LIMIT 1", [emailUsuario, idUsuario]);
                const idReal = userRows[0]?.id_usuario;

                const [assinaturaExiste] = await pool.query(
                    "SELECT id_assinatura FROM Assinaturas WHERE id_usuario = ? ORDER BY id_assinatura DESC LIMIT 1",
                    [idReal]
                );

                if (assinaturaExiste.length > 0) {
                    await pool.query(
                        `UPDATE Assinaturas SET id_plano = ?, status = 'Ativo' WHERE id_assinatura = ?`,
                        [idPlano, assinaturaExiste[0].id_assinatura]
                    );
                } else {
                    await pool.query(
                        `INSERT INTO Assinaturas (id_usuario, id_plano, status, data_inicio) VALUES (?, ?, 'Ativo', NOW())`,
                        [idReal, idPlano]
                    );
                }
            }
        }

        return res.status(200).json({ 
            message: "Perfil e plano atualizados com sucesso!",
            foto: caminhoFotoBanco 
        });

    } catch (error) {
        console.error("Erro na rota PUT /perfil:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "O username ou e-mail informado já está em uso." });
        }

        return res.status(500).json({ error: "Erro interno ao atualizar os dados do perfil." });
    }
});

export default router;