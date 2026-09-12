// import express from "express";
// import cors from "cors";
// import dotenv  from "dotenv";
// import cookieParser from "cookie-parser";
// import routeCompras from "./src/routes/comprasRoutes.js";
// import routeCategoria from "./src/routes/categoriaRoutes.js";
// import routeClientes from "./src/routes/clienteRoutes.js";
// import routeEditoras from "./src/routes/editoraRoutes.js";
// import routeLivro from "./src/routes/livroRoutes.js";
// import userRouter from "./src/routes/userRoute.js";
// import loginRoute from "./src/routes/loginRoute.js";
// import enderecoRouter from "./src/routes/enderecoRoute.js";
// import uploadRoute from "./src/routes/uploadRoute.js";




// dotenv.config();

// const app = express();

// app.use(express.json());

// app.use(cors({
//   origin: "http://localhost:3001",
//   credentials: true,
// }));

// app.use(cookieParser());

// const PORT = process.env.PORT_SERVER || 3001;

// app.use("/clientes", routeClientes);
// app.use("/compras", routeCompras);
// app.use("/categorias", routeCategoria);
// app.use("/livros", routeLivro);
// app.use("/editoras", routeEditoras);
// app.use("/users", userRouter);
// app.use("/auth", loginRoute);
// app.use("/endereco", enderecoRouter);
// app.use("/upload", uploadRoute);

// app.listen(PORT, () => {
//   return console.log(`Servidor rodando http://localhost:${PORT}`);
// });


// //segundo codigo---------------------------------------------------
 
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
 
// // Importação das rotas
// // import routeCompras from "./src/routes/comprasRoutes.js";
// // import routeCategoria from "./src/routes/categoriaRoutes.js";
// // import routeClientes from "./src/routes/clienteRoutes.js";
// // import routeEditoras from "./src/routes/editoraRoutes.js";
// // import routeLivro from "./src/routes/livroRoutes.js";
// import routeLooks from "./src/routes/routeLooks.js"; // Nova rota do Montalook
// import rotaCliente from "./src/routes/clienteRoute.js";
// import loginRoute from "./src/routes/loginRoute.js";


// dotenv.config();
 
// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use('/frontend', express.static('../frontend'));
// app.use("/login", loginRoute)
 
// const PORT = process.env.PORT_SERVER || 3001;
 
// // Ativação dos endpoints
// // app.use("/clientes", routeClientes);
// // app.use("/compras", routeCompras);
// // app.use("/categorias", routeCategoria);
// // app.use("/livros", routeLivro);
// // app.use("/editoras", routeEditoras);
// app.use("/looks", routeLooks); // Endpoint para o formulário inteligente
// app.use("/clientes", rotaCliente);
// // Configuração do __dirname para ES Modules (ESM)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
 
// // Servir a pasta de uploads localmente de forma correta
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
 
// app.listen(PORT, () => {
//   console.log(`Servidor rodando em http://localhost:${PORT}`);
// });











// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// dotenv.config();

// // Importação das rotas ativas do MontaLook
// import routeLooks from "./src/routes/routeLooks.js";
// import rotaCliente from "./src/routes/clienteRoute.js";
// import loginRoute from "./src/routes/loginRoute.js";



// const app = express();

// // --- 1. MIDDLEWARES GLOBAIS ---
// app.use(express.json());
// app.use(cors());

// app.use((req, res, next) => {
//   res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
//   res.set('Pragma', 'no-cache');
//   res.set('Expires', '0');
//   next();
// });

// // --- 2. CONFIGURAÇÃO DE DIRETÓRIOS E ESTÁTICOS (ESM) ---
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use('/frontend', express.static(path.join(__dirname, '../frontend')));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // --- 3. ATIVAÇÃO DOS ENDPOINTS / ROTAS ---
// // Concentra Login e Cadastro sob o prefixo /auth
// // app.use("/auth", loginRoute); 
// app.use("/looks", routeLooks);
// app.use("/clientes", rotaCliente);
// app.use("/", loginRoute);


// // --- 4. INICIALIZAÇÃO DO SERVIDOR ---
// const PORT = process.env.PORT_SERVER || 3001;

// app.listen(PORT, () => {
//   console.log(`🚀 Servidor MontaLook rodando em http://localhost:${PORT}`);
// });














// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// dotenv.config();

// // Importação das rotas ativas do MontaLook
// import routeLooks from "./src/routes/routeLooks.js";
// import rotaCliente from "./src/routes/clienteRoute.js";
// import loginRoute from "./src/routes/loginRoute.js";

// const app = express();

// // --- 1. MIDDLEWARES GLOBAIS ---
// app.use(express.json());
// app.use(cors());

// app.use((req, res, next) => {
//   res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
//   res.set('Pragma', 'no-cache');
//   res.set('Expires', '0');
//   next();
// });

// // --- 2. CONFIGURAÇÃO DE DIRETÓRIOS E ESTÁTICOS (ESM) ---
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use('/frontend', express.static(path.join(__dirname, '../frontend')));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // --- 3. ATIVAÇÃO DOS ENDPOINTS / ROTAS ---
// // Mapeia as rotas de auth/login/perfil tanto sob /auth quanto na raiz para evitar divergência com o frontend
// app.use("/auth", loginRoute);
// app.use("/", loginRoute);

// app.use("/looks", routeLooks);
// app.use("/clientes", rotaCliente);


// // --- 4. TRATAMENTO DE ERROS E ROTAS NÃO ENCONTRADAS ---
// // Captura requisições para rotas inexistentes
// app.use((req, res) => {
//   console.warn(`⚠️ Rota não encontrada: ${req.method} ${req.originalUrl}`);
//   res.status(404).json({ error: `Rota ${req.originalUrl} não encontrada no servidor.` });
// });

// // Middleware global de tratamento de exceções
// app.use((err, req, res, next) => {
//   console.error("🔥 Erro não tratado no servidor:", err);
//   res.status(500).json({ error: "Erro interno no servidor." });
// });

// // --- 5. INICIALIZAÇÃO DO SERVIDOR ---
// const PORT = process.env.PORT_SERVER || 3001;

// app.listen(PORT, () => {
//   console.log(`🚀 Servidor MontaLook rodando na porta ${PORT}`);
// });

















// import express from "express";
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// // Carrega as variáveis do arquivo .env
// dotenv.config();

// const app = express();
// app.use(express.json());

// // Configuração do transporter
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// // Teste de conexão com o e-mail
// transporter.verify((error) => {
//     if (error) {
//         console.error("🔥 Erro ao autenticar no e-mail:", error);
//     } else {
//         console.log("✅ Servidor pronto para enviar e-mails!");
//     }
// });

// // Rota de Cadastro
// app.post("/api/usuarios", async (req, res) => {
//     try {
//         const { nome, email, cpf, senha, plano, pagamento, cartao } = req.body;

//         // Gerar token de 6 dígitos
//         const tokenVerificacao = Math.floor(100000 + Math.random() * 900000).toString();

//         // Envio do e-mail
//         await transporter.sendMail({
//             from: `"MontaLook" <${process.env.EMAIL_USER}>`,
//             to: email,
//             subject: "Confirme seu cadastro - MontaLook",
//             html: `
//                 <div style="font-family: Arial, sans-serif; padding: 20px;">
//                     <h2>Olá, ${nome}!</h2>
//                     <p>Seu código de verificação para ativar a conta é:</p>
//                     <h1 style="color: #6E5F5D; letter-spacing: 4px;">${tokenVerificacao}</h1>
//                 </div>
//             `
//         });

//         return res.status(201).json({
//             mensagem: "Usuário cadastrado com sucesso!",
//             token: tokenVerificacao
//         });

//     } catch (erro) {
//         console.error("Erro no servidor:", erro);
//         return res.status(500).json({ error: "Erro interno no servidor." });
//     }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Servidor rodando na porta ${PORT}`);
// });


// import express from "express";
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import cors from "cors";
// import jwt from "jsonwebtoken";

// dotenv.config();

// const app = express();
// app.use(express.static('./'));

// // Permite chamadas do Frontend no navegador
// app.use(cors());
// app.use(express.json());

// // Configuração do transporter
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// // Teste de conexão com o e-mail ao iniciar
// transporter.verify((error) => {
//     if (error) {
//         console.error("🔥 Erro ao autenticar no e-mail:", error);
//     } else {
//         console.log("✅ Servidor pronto para enviar e-mails!");
//     }
// });

// // Rota de Cadastro e Envio do Token
// app.post("/api/usuarios", async (req, res) => {
//     try {
//         const { nome, email, cpf, senha, plano, pagamento, cartao } = req.body;

//         if (!email) {
//             return res.status(400).json({ error: "O e-mail é obrigatório." });
//         }

//         // 1. Código numérico de 6 dígitos (para digitação manual se necessário)
//         const codigoNumerico = Math.floor(100000 + Math.random() * 900000).toString();

//         // 2. Token JWT assinado com o JWT_SECRET do .env (expira em 1 hora)
//         const tokenJWT = jwt.sign(
//             { email, nome },
//             process.env.JWT_SECRET,
//             { expiresIn: "1h" }
//         );

//         // 3. Link direto para o Frontend passar o token
//   const baseUrl = process.env.FRONTEND_URL || "http://127.0.0.1:5500/montaLook/frontend";
// const linkAcesso = `${baseUrl}/login.html?token=${tokenJWT}`;
//         // 4. Envio do e-mail
//         await transporter.sendMail({
//             from: `"MontaLook" <${process.env.EMAIL_USER}>`,
//             to: email,
//             subject: "Confirme seu cadastro - MontaLook",
//             html: `
//                 <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
//                     <h2>Olá, ${nome || 'Usuário'}!</h2>
//                     <p>Seu código de verificação para ativar a conta é:</p>
//                     <h1 style="color: #6E5F5D; letter-spacing: 4px;">${codigoNumerico}</h1>
                    
//                     <p style="margin-top: 20px;">Ou acesse diretamente pelo botão abaixo:</p>
//                     <a href="${linkAcesso}" style="background-color: #6E5F5D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
//                         Confirmar Cadastro
//                     </a>
//                 </div>
//             `
//         });

//         // Retorna o token JWT e o código numérico
//         return res.status(201).json({
//             mensagem: "Usuário cadastrado com sucesso! Verifique seu e-mail.",
//             token: tokenJWT,
//             codigo: codigoNumerico
//         });

//     } catch (erro) {
//         console.error("Erro no servidor:", erro);
//         return res.status(500).json({ error: "Erro interno no servidor." });
//     }
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//     console.log(`🚀 Servidor rodando na porta ${PORT}`);
// });



















// import express from "express";
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import cors from "cors";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

// // Conexão com o banco de dados
// import pool from "./src/database/database.js";

// // Rotas centralizadas
// import usuarioRoutes from "./src/routes/loginRoute.js";
// import routeLook from "./src/routes/routeLooks.js";

// dotenv.config();

// const app = express();

// // Middlewares Globais (Comunicação JSON e CORS)
// app.use(cors());
// app.use(express.json()); 
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("./"));

// // Conecta o roteador principal sob o prefixo /api
// app.use("/api", usuarioRoutes);
// app.use("/api", routeLook);

// // Configuração do transporter Nodemailer
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// // Teste de conexão com o servidor de e-mail ao iniciar
// transporter.verify((error) => {
//     if (error) {
//         console.error("🔥 Erro ao autenticar no e-mail (Verifique EMAIL_USER/EMAIL_PASS no .env):", error.message);
//     } else {
//         console.log("✅ Servidor SMTP pronto para enviar e-mails!");
//     }
// });

// // Rota de Envio de Token / Verificação Registrando no MySQL
// app.post("/api/usuarios", async (req, res) => {
//     try {
//         const { nome, email, cpf, senha, id_usuario } = req.body;

//         // Validação estrita: impede e-mail ou CPF nulos/vazios
//         if (!email || !email.trim()) {
//             return res.status(400).json({ error: "O e-mail é obrigatório." });
//         }

//         if (!cpf || !cpf.trim()) {
//             return res.status(400).json({ error: "O CPF é obrigatório e não pode ser nulo." });
//         }

//         const emailFormatado = email.trim().toLowerCase();
//         const cpfFormatado = cpf.trim();

//         // 1. Gera código numérico de 6 dígitos
//         const codigoNumerico = Math.floor(100000 + Math.random() * 900000).toString();

//         // 2. Busca o usuário no banco por e-mail ou CPF
//         const [users] = await pool.query(
//             "SELECT id_usuario FROM Usuarios WHERE LOWER(email) = ? OR cpf = ? LIMIT 1",
//             [emailFormatado, cpfFormatado]
//         );

//         let idFinal = id_usuario;

//         if (users && users.length > 0) {
//             idFinal = users[0].id_usuario;
            
//             // Atualiza o código de verificação do usuário existente
//             try {
//                 await pool.query(
//                     "UPDATE Usuarios SET codigo_verificacao = ? WHERE id_usuario = ?",
//                     [codigoNumerico, idFinal]
//                 );
//             } catch (updateErr) {
//                 if (updateErr.code !== 'ER_BAD_FIELD_ERROR') {
//                     console.error("Erro ao atualizar codigo_verificacao:", updateErr.message);
//                 } else {
//                     console.warn("⚠️ Aviso: A coluna 'codigo_verificacao' não existe no banco.");
//                 }
//             }
//         } else {
//             // Criptografa a senha enviada ou cria um hash para a senha fornecida
//             const senhaHash = await bcrypt.hash(senha || "123456", 10);

//             try {
//                 // Insere com o CPF real e válido enviado pelo frontend
//                 const [resultado] = await pool.query(
//                     `INSERT INTO Usuarios (nome, email, cpf, senha, codigo_verificacao, status, data_criacao) 
//                      VALUES (?, ?, ?, ?, ?, 'pendente', NOW())`,
//                     [nome || "Usuário", emailFormatado, cpfFormatado, senhaHash, codigoNumerico]
//                 );
//                 idFinal = resultado.insertId;
//             } catch (insertErr) {
//                 if (insertErr.code === 'ER_BAD_FIELD_ERROR') {
//                     // Fallback caso a coluna codigo_verificacao não exista
//                     const [resultadoFallback] = await pool.query(
//                         `INSERT INTO Usuarios (nome, email, cpf, senha, status, data_criacao) 
//                          VALUES (?, ?, ?, ?, 'pendente', NOW())`,
//                         [nome || "Usuário", emailFormatado, cpfFormatado, senhaHash]
//                     );
//                     idFinal = resultadoFallback.insertId;
//                 } else {
//                     throw insertErr;
//                 }
//             }
//         }

//         // 3. Chave secreta alinhada
//         const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "sua_chave_secreta_aqui";

//         // 4. Token JWT com ID garantido
//         const tokenJWT = jwt.sign(
//             { 
//                 id: idFinal, 
//                 email: emailFormatado, 
//                 nome: nome || "Usuário" 
//             },
//             SECRET_KEY,
//             { expiresIn: "1h" }
//         );

//         // 5. Link direto para o Frontend
//         const baseUrl = process.env.FRONTEND_URL || "http://127.0.0.1:5500/montaLook/frontend";
//         const linkAcesso = `${baseUrl}/login.html?token=${tokenJWT}`;

//         // 6. Envio do e-mail
//         try {
//             await transporter.sendMail({
//                 from: `"MontaLook" <${process.env.EMAIL_USER}>`,
//                 to: emailFormatado,
//                 subject: "Confirme seu cadastro - MontaLook",
//                 html: `
//                     <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
//                         <h2>Olá, ${nome || 'Usuário'}!</h2>
//                         <p>Seu código de verificação para ativar a conta é:</p>
//                         <h1 style="color: #6E5F5D; letter-spacing: 4px;">${codigoNumerico}</h1>
                        
//                         <p style="margin-top: 20px;">Ou acesse diretamente pelo botão abaixo:</p>
//                         <a href="${linkAcesso}" style="background-color: #6E5F5D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
//                             Confirmar Cadastro
//                         </a>
//                     </div>
//                 `
//             });
//         } catch (mailErr) {
//             console.error("🔥 ERRO NO ENVIO DE E-MAIL (Nodemailer):", mailErr);
//             return res.status(500).json({ 
//                 error: "Falha ao enviar e-mail. Verifique a Senha de App no arquivo .env." 
//             });
//         }

//         return res.status(201).json({
//             mensagem: "Usuário cadastrado/atualizado com sucesso! Verifique seu e-mail.",
//             token: tokenJWT,
//             codigo: codigoNumerico
//         });

//     } catch (erro) {
//         console.error("🔥 Erro detalhado no banco de dados:", erro);

//         if (erro.code === 'ER_DUP_ENTRY') {
//             return res.status(400).json({ error: "E-mail ou CPF já cadastrado no sistema." });
//         }

//         if (erro.code === 'ER_BAD_NULL_ERROR') {
//             return res.status(400).json({ error: "Não é permitido registrar campos obrigatórios (CPF/E-mail) como nulos." });
//         }

//         return res.status(500).json({ error: "Erro interno no servidor ao processar solicitação." });
//     }
// });

// // Inicialização do Servidor
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//     console.log(`🚀 Servidor rodando na porta ${PORT}`);
// });








import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";

// Conexão com o banco de dados
import pool from "./src/database/database.js";

// Rotas centralizadas
import usuarioRoutes from "./src/routes/loginRoute.js";
import routeLook from "./src/routes/routeLooks.js";

dotenv.config();

const app = express();

// Middlewares Globais (Comunicação JSON e CORS)
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Servir arquivos estáticos (Uploads e Imagens dos Looks)
app.use(express.static("./"));

// Registra as rotas da aplicação sob o prefixo /api
app.use("/api", usuarioRoutes);
app.use("/looks", routeLook);

// Configuração do transporter Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Teste de conexão com o servidor de e-mail ao iniciar
transporter.verify((error) => {
    if (error) {
        console.error("🔥 Erro ao autenticar no e-mail (Verifique EMAIL_USER/EMAIL_PASS no .env):", error.message);
    } else {
        console.log("✅ Servidor SMTP pronto para enviar e-mails!");
    }
});

// Rota de Envio de Token / Verificação Registrando no MySQL
app.post("/api/usuarios", async (req, res) => {
    try {
        const { nome, email, cpf, senha, id_usuario } = req.body;

        // Validação estrita: impede e-mail ou CPF nulos/vazios
        if (!email || !email.trim()) {
            return res.status(400).json({ error: "O e-mail é obrigatório." });
        }

        if (!cpf || !cpf.trim()) {
            return res.status(400).json({ error: "O CPF é obrigatório e não pode ser nulo." });
        }

        const emailFormatado = email.trim().toLowerCase();
        const cpfFormatado = cpf.trim();

        // 1. Gera código numérico de 6 dígitos
        const codigoNumerico = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. Busca o usuário no banco por e-mail ou CPF
        const [users] = await pool.query(
            "SELECT id_usuario FROM Usuarios WHERE LOWER(email) = ? OR cpf = ? LIMIT 1",
            [emailFormatado, cpfFormatado]
        );

        let idFinal = id_usuario;

        if (users && users.length > 0) {
            idFinal = users[0].id_usuario;
            
            // Atualiza o código de verificação do usuário existente
            try {
                await pool.query(
                    "UPDATE Usuarios SET codigo_verificacao = ? WHERE id_usuario = ?",
                    [codigoNumerico, idFinal]
                );
            } catch (updateErr) {
                if (updateErr.code !== 'ER_BAD_FIELD_ERROR') {
                    console.error("Erro ao atualizar codigo_verificacao:", updateErr.message);
                } else {
                    console.warn("⚠️ Aviso: A coluna 'codigo_verificacao' não existe no banco.");
                }
            }
        } else {
            // Criptografa a senha enviada
            const senhaHash = await bcrypt.hash(senha || "123456", 10);

            try {
                const [resultado] = await pool.query(
                    `INSERT INTO Usuarios (nome, email, cpf, senha, codigo_verificacao, status, data_criacao) 
                     VALUES (?, ?, ?, ?, ?, 'pendente', NOW())`,
                    [nome || "Usuário", emailFormatado, cpfFormatado, senhaHash, codigoNumerico]
                );
                idFinal = resultado.insertId;
            } catch (insertErr) {
                if (insertErr.code === 'ER_BAD_FIELD_ERROR') {
                    const [resultadoFallback] = await pool.query(
                        `INSERT INTO Usuarios (nome, email, cpf, senha, status, data_criacao) 
                         VALUES (?, ?, ?, ?, 'pendente', NOW())`,
                        [nome || "Usuário", emailFormatado, cpfFormatado, senhaHash]
                    );
                    idFinal = resultadoFallback.insertId;
                } else {
                    throw insertErr;
                }
            }
        }



        router.post("/usuarios/confirmar", async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: "Token não fornecido." });
        }

        // Validação do token JWT e atualização no banco:
        // UPDATE Usuarios SET status = 'ativo' WHERE id_usuario = ...

        return res.status(200).json({ sucesso: true, message: "Conta ativada com sucesso!" });
    } catch (err) {
        return res.status(400).json({ error: "Token inválido ou expirado." });
    }
});



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Torna os arquivos da pasta fotos_usuarios acessíveis publicamente pela URL
app.use("/fotos_usuarios", express.static(path.join(__dirname, "fotos_usuarios")));

        // 3. Chave secreta JWT
        const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "sua_chave_secreta_aqui";

        // 4. Token JWT com ID
        const tokenJWT = jwt.sign(
            { 
                id: idFinal, 
                email: emailFormatado, 
                nome: nome || "Usuário" 
            },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        // 5. Link direto para o Frontend
        const baseUrl = process.env.FRONTEND_URL || "http://127.0.0.1:5500/montaLook/frontend";
        const linkAcesso = `${baseUrl}/login.html?token=${tokenJWT}`;

        // 6. Envio do e-mail
        try {
            await transporter.sendMail({
                from: `"MontaLook" <${process.env.EMAIL_USER}>`,
                to: emailFormatado,
                subject: "Confirme seu cadastro - MontaLook",
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h2>Olá, ${nome || 'Usuário'}!</h2>
                        <p>Seu código de verificação para ativar a conta é:</p>
                        <h1 style="color: #6E5F5D; letter-spacing: 4px;">${codigoNumerico}</h1>
                        
                        <p style="margin-top: 20px;">Ou acesse diretamente pelo botão abaixo:</p>
                        <a href="${linkAcesso}" style="background-color: #6E5F5D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Confirmar Cadastro
                        </a>
                    </div>
                `
            });
        } catch (mailErr) {
            console.error("🔥 ERRO NO ENVIO DE E-MAIL (Nodemailer):", mailErr);
            return res.status(500).json({ 
                error: "Falha ao enviar e-mail. Verifique a Senha de App no arquivo .env." 
            });
        }

        return res.status(201).json({
            mensagem: "Usuário cadastrado/atualizado com sucesso! Verifique seu e-mail.",
            token: tokenJWT,
            codigo: codigoNumerico
        });

    } catch (erro) {
        console.error("🔥 Erro detalhado no banco de dados:", erro);

        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "E-mail ou CPF já cadastrado no sistema." });
        }

        if (erro.code === 'ER_BAD_NULL_ERROR') {
            return res.status(400).json({ error: "Não é permitido registrar campos obrigatórios (CPF/E-mail) como nulos." });
        }

        return res.status(500).json({ error: "Erro interno no servidor ao processar solicitação." });
    }
});

// Middleware para tratar rotas inexistentes (404)
app.use((req, res) => {
    res.status(404).json({ error: `Rota ${req.originalUrl} não encontrada no servidor.` });
});

// Inicialização do Servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});