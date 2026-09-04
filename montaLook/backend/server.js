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

// //         // 3. Link direto para o Frontend passar o token
// //   const baseUrl = process.env.FRONTEND_URL || "http://127.0.0.1:5500/montaLook/frontend";
// // const linkAcesso = `${baseUrl}/login.html?token=${tokenJWT}`;
// //         // 4. Envio do e-mail
// //         await transporter.sendMail({
// //             from: `"MontaLook" <${process.env.EMAIL_USER}>`,
// //             to: email,
// //             subject: "Confirme seu cadastro - MontaLook",
// //             html: `
// //                 <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
// //                     <h2>Olá, ${nome || 'Usuário'}!</h2>
// //                     <p>Seu código de verificação para ativar a conta é:</p>
// //                     <h1 style="color: #6E5F5D; letter-spacing: 4px;">${codigoNumerico}</h1>
                    
// //                     <p style="margin-top: 20px;">Ou acesse diretamente pelo botão abaixo:</p>
// //                     <a href="${linkAcesso}" style="background-color: #6E5F5D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
// //                         Confirmar Cadastro
// //                     </a>
// //                 </div>
// //             `
// //         });


// // 3. Link direto para o Frontend passar o token
// const baseUrl = process.env.FRONTEND_URL || "http://localhost:5500/frontend";
// const linkAcesso = `${baseUrl}/login.html?token=${tokenJWT}`;

// // 4. Envio do e-mail
// await transporter.sendMail({
//     from: `"MontaLook" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "Confirme seu cadastro - MontaLook",
//     html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
//             <h2>Olá, ${nome || 'Usuário'}!</h2>
//             <p>Seu código de verificação para ativar a conta é:</p>
//             <h1 style="color: #6E5F5D; letter-spacing: 4px;">${codigoNumerico}</h1>
            
//             <p style="margin-top: 20px;">Ou acesse diretamente pelo botão abaixo:</p>
//             <a href="${linkAcesso}" style="background-color: #6E5F5D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
//                 Confirmar Cadastro
//             </a>
//         </div>
//     `
// });

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

// // Importa as rotas centralizadas (login, cadastro, confirmar-email, perfil)
// import usuarioRoutes from "../backend/src/routes/loginRoute.js";

// dotenv.config();

// const app = express();

// // Middlewares Globais
// app.use(cors());
// app.use(express.json());
// app.use(express.static("./"));

// // Conecta o roteador principal sob o prefixo /api
// app.use("/api", usuarioRoutes);

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
//         console.error("🔥 Erro ao autenticar no e-mail:", error);
//     } else {
//         console.log("✅ Servidor pronto para enviar e-mails!");
//     }
// });

// // Rota de Cadastro de Teste / Envio Direto de Token (Opcional)
// app.post("/api/usuarios", async (req, res) => {
//     try {
//         const { nome, email } = req.body;

//         if (!email) {
//             return res.status(400).json({ error: "O e-mail é obrigatório." });
//         }

//         // 1. Código numérico de 6 dígitos
//         const codigoNumerico = Math.floor(100000 + Math.random() * 900000).toString();

//         // 2. Token JWT assinado com JWT_SECRET (expira em 1 hora)
//         const tokenJWT = jwt.sign(
//             { email, nome },
//             process.env.JWT_SECRET || "sua_chave_secreta_aqui",
//             { expiresIn: "1h" }
//         );

//         // 3. Link direto para o Frontend
//         const baseUrl = process.env.FRONTEND_URL || "http://localhost:5500/frontend";
//         const linkAcesso = `${baseUrl}/login.html?token=${tokenJWT}`;

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

// // Inicialização do Servidor
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//     console.log(`🚀 Servidor rodando na porta ${PORT}`);
// });



// import express from "express"; // Importa o framework Express para criar rotas e o servidor HTTP
// import nodemailer from "nodemailer"; // Importa a biblioteca para envio automatizado de e-mails
// import dotenv from "dotenv"; // Importa a biblioteca para ler variáveis de ambiente (.env)
// import cors from "cors"; // Importa o middleware para liberar requisições de origens diferentes (CORS)
// import jwt from "jsonwebtoken"; // Importa a biblioteca para gerar e validar tokens de autenticação (JWT)

// // Importa o roteador central com as rotas de autenticação e usuário
// import usuarioRoutes from "../backend/src/routes/loginRoute.js";
// import path from "path";
// import { fileURLToPath } from "url";

// dotenv.config(); // Carrega as variáveis declaradas no arquivo .env para process.env

// const app = express(); // Inicializa a aplicação Express

// // Middlewares Globais
// app.use(cors()); // Habilita o CORS para que o frontend possa consultar a API sem bloqueio do navegador
// app.use(express.json()); // Configura o Express para interpretar requisições com corpo no formato JSON
// app.use(express.static("./")); // Serve arquivos estáticos (HTML, CSS, JS) localizados na raiz do projeto

// // Conecta o roteador principal sob o prefixo /api (ex: /api/login, /api/perfil)
// app.use("/api", usuarioRoutes);

// // Configuração do transporter do Nodemailer (módulo de envio)
// const transporter = nodemailer.createTransport({
//     service: "gmail", // Define o provedor de e-mail utilizado
//     auth: {
//         user: process.env.EMAIL_USER, // E-mail remetente obtido das variáveis de ambiente
//         pass: process.env.EMAIL_PASS  // Senha de aplicativo do e-mail obtida do arquivo .env
//     }
// });


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ limit: '10mb', extended: true }));

// // Libera os arquivos da pasta frontend para o navegador acessar
// app.use(express.static(path.join(__dirname, "../frontend")));

// // Teste de conexão com o servidor de e-mail ao iniciar a aplicação
// transporter.verify((error) => {
//     if (error) {
//         console.error("🔥 Erro ao autenticar no e-mail:", error); // Exibe erro se as credenciais falharem
//     } else {
//         console.log("✅ Servidor pronto para enviar e-mails!"); // Confirma que o serviço de e-mail está ativo
//     }
// });

// // Rota de Cadastro de Teste / Envio Direto de Token
// app.post("/api/usuarios", async (req, res) => { // Define a rota HTTP POST para cadastrar/enviar e-mail
//     try {
//         const { nome, email } = req.body; // Extrai as propriedades 'nome' e 'email' enviadas no corpo da requisição

//         if (!email) { // Validação básica para garantir o envio do e-mail
//             return res.status(400).json({ error: "O e-mail é obrigatório." }); // Retorna status 400 se o e-mail faltar
//         }

//         // 1. Gera um código numérico aleatório de 6 dígitos (ex: 482910)
//         const codigoNumerico = Math.floor(100000 + Math.random() * 900000).toString();

//         // 2. Cria um token JWT assinado contendo os dados do usuário com validade de 1 hora
//         const tokenJWT = jwt.sign(
//             { email, nome }, // Payload (dados armazenados dentro do token)
//             process.env.JWT_SECRET || "sua_chave_secreta_aqui", // Chave secreta para assinatura digital
//             { expiresIn: "1h" } // Define o tempo limite de expiração do token
//         );

//         // 3. Monta a URL dinâmica apontando para a página de login do frontend com o token via Query String
//         const baseUrl = process.env.FRONTEND_URL || "http://localhost:5500/frontend";
//         const linkAcesso = `${baseUrl}/login.html?token=${tokenJWT}`;

//         // 4. Envia o e-mail de confirmação formatado em HTML
//         await transporter.sendMail({
//             from: `"MontaLook" <${process.env.EMAIL_USER}>`, // Nome de exibição e e-mail remetente
//             to: email, // E-mail do destinatário
//             subject: "Confirme seu cadastro - MontaLook", // Assunto da mensagem
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
//             ` // Template HTML estilizado para a caixa de entrada
//         });

//         // Resposta de sucesso enviada ao cliente/frontend
//         return res.status(201).json({
//             mensagem: "Usuário cadastrado com sucesso! Verifique seu e-mail.",
//             token: tokenJWT,
//             codigo: codigoNumerico
//         });

//     } catch (erro) {
//         console.error("Erro no servidor:", erro); // Captura e exibe falhas internas de execução no terminal
//         return res.status(500).json({ error: "Erro interno no servidor." }); // Retorna erro genérico ao cliente
//     }
// });

// // Inicialização do Servidor HTTP
// const PORT = process.env.PORT || 3001; // Define a porta vinda do .env ou usa 3001 como padrão
// app.listen(PORT, () => {
//     console.log(`🚀 Servidor rodando na porta ${PORT}`); // Inicia a escuta de requisições na porta configurada
// });








//esta funcionando-------------------------------------------------------------------------------

import express from "express"; // Importa o framework Express para criar rotas e o servidor HTTP
import nodemailer from "nodemailer"; // Importa a biblioteca para envio automatizado de e-mails
import dotenv from "dotenv"; // Importa a biblioteca para ler variáveis de ambiente (.env)
import cors from "cors"; // Importa o middleware para liberar requisições de origens diferentes (CORS)
import jwt from "jsonwebtoken"; // Importa a biblioteca para gerar e validar tokens de autenticação (JWT)
import routeLooks from "../backend/src/routes/routeLooks.js"
import usuarioRoutes from "../backend/src/routes/loginRoute.js";
import loginRoute from "../backend/src/routes/loginRoute.js"
import path from "path";
import { fileURLToPath } from "url";
import Stripe from 'stripe';
import cookieParser from "cookie-parser";
import conteudoHomeRoute from "./src/routes/conteudoHomeRoute.js";
import rotaCliente from "./src/routes/clienteRoute.js";



const app = express(); // Inicializa a aplicação Express

dotenv.config(); // Carrega as variáveis declaradas no arquivo .env para process.env
app.use(cors()); // Agora funciona sem erro
app.use(express.json());
app.use(cookieParser());

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_sua_chave_secreta_aqui');
const stripe = process.env.STRIPE_SECRET_KEY || 'sk_test_sua_chave_secreta_aqui'
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;


app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. MIDDLEWARES DE SEGURANÇA E PARSER (DEVEM VIR ANTES DE TODAS AS ROTAS)


// Adicione essa linha junto aos outros middlewares de arquivos estáticos
app.use('/fotos_usuarios', express.static(path.join(__dirname, '../fotos_usuarios')));

// Configura o parser do JSON com o limite expandido de 10MB para aceitar fotos Base64
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

 app.use("/looks", routeLooks);

// Serve arquivos estáticos (HTML, CSS, JS)
app.use(express.static("./"));
app.use(express.static(path.join(__dirname, "../frontend")));

// 2. ROTAS DA API (DEVEM VIR DEPOIS DO PARSER DE 10MB)
app.use("/api", usuarioRoutes);

// Configuração do transporter do Nodemailer (módulo de envio)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


app.post("/clientes/criar-pagamento-cartao", loginRoute);
app.post("/clientes/criar-pagamento-pix", loginRoute);
app.use("/api", loginRoute);

app.use("/frontend", express.static(path.join(__dirname, "../frontend")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const paginasFront = [
  "index",
  "login",
  "cadastro",
  "quem_somos",
  "planos",
  "celebridades",
  "maquiagem",
  "cores1",
  "looks",
  "corpos",
  "Unisex",
  "unisex",
  "idades",
  "brecho1",
  "modabrasileira1",
  "formulario",
  "perfil",
  "meus_looks",
  "admin",
];

paginasFront.forEach((pagina) => {
  const nomeArquivo = pagina === "index" ? "index.html" : `${pagina}.html`;
  const rota = pagina === "index" ? "/" : `/${pagina}`;

  app.get(rota, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", nomeArquivo));
  });
});


app.use("/clientes", rotaCliente);
app.use("/conteudo-home", conteudoHomeRoute);


app.post("/criar-pagamento", async (req, res) => {
  if (!stripe) {
    return res
      .status(503)
      .json({ error: "Stripe não configurado no servidor." });
  }


  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(req.body?.amount) || 2000,
      currency: "brl",
      payment_method_types: ["card"],
    });

    return res.json({
      sucesso: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Erro ao criar pagamento Stripe:", error);
    return res
      .status(500)
      .json({ error: "Não foi possível criar o pagamento." });
  }
});



// O Chrome DevTools consulta este arquivo automaticamente durante o desenvolvimento.
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.sendStatus(204);
});

// --- 4. TRATAMENTO DE ERROS E ROTAS NÃO ENCONTRADAS ---
// Captura requisições para rotas inexistentes
app.use((req, res) => {
  console.warn(`⚠️ Rota não encontrada: ${req.method} ${req.originalUrl}`);
  res
    .status(404)
    .json({ error: `Rota ${req.originalUrl} não encontrada no servidor.` });
});


// Middleware global de tratamento de exceções
app.use((err, req, res, next) => {
  console.error("🔥 Erro não tratado no servidor:", err);
  res.status(500).json({ error: "Erro interno no servidor." });
});

// ROTAS PARA PROCESSAMENTO DE PAGAMENTO DA STRIPE
// =========================================================

// Rota para pagamento com Cartão
app.post("/clientes/criar-pagamento-cartao", async (req, res) => {
    try {
        const { valor } = req.body; // Valor em centavos (ex: 499 para R$ 4,99)

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


// Rota para pagamento com Pix
app.post("/clientes/criar-pagamento-pix", async (req, res) => {
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
// Teste de conexão com o servidor de e-mail ao iniciar a aplicação
transporter.verify((error) => {
    if (error) {
        console.error("🔥 Erro ao autenticar no e-mail:", error);
    } else {
        console.log("✅ Servidor pronto para enviar e-mails!");
    }
});

// Rota de Cadastro de Teste / Envio Direto de Token
app.post("/api/usuarios", async (req, res) => {
    try {
        const { nome, email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "O e-mail é obrigatório." });
        }

        const codigoNumerico = Math.floor(100000 + Math.random() * 900000).toString();

        const tokenJWT = jwt.sign(
            { email, nome },
            process.env.JWT_SECRET || "sua_chave_secreta_aqui",
            { expiresIn: "1h" }
        );

        const baseUrl = process.env.FRONTEND_URL || "http://localhost:5500/frontend";
        const linkAcesso = `${baseUrl}/login.html?token=${tokenJWT}`;

        await transporter.sendMail({
            from: `"MontaLook" <${process.env.EMAIL_USER}>`,
            to: email,
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

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso! Verifique seu e-mail.",
            token: tokenJWT,
            codigo: codigoNumerico
        });

    } catch (erro) {
        console.error("Erro no servidor:", erro);
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
});

// Inicialização do Servidor HTTP
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});














// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// import Stripe from "stripe";

// dotenv.config();

// const stripe = process.env.STRIPE_SECRET_KEY
//   ? new Stripe(process.env.STRIPE_SECRET_KEY)
//   : null;

// // Importação das rotas ativas do MontaLook
// import routeLooks from "./src/routes/routeLooks.js";
// import rotaCliente from "./src/routes/clienteRoute.js";
// import loginRoute from "./src/routes/loginRoute.js";
// import conteudoHomeRoute from "./src/routes/conteudoHomeRoute.js";

// const app = express();

// // --- 1. MIDDLEWARES GLOBAIS ---
// app.use(express.json());
// app.use(cors());
// app.use(cookieParser());

// app.use((req, res, next) => {
//   res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
//   res.set("Pragma", "no-cache");
//   res.set("Expires", "0");
//   next();
// });

// // --- 2. CONFIGURAÇÃO DE DIRETÓRIOS E ESTÁTICOS (ESM) ---
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(express.static(path.join(__dirname, "../frontend")));
// app.use("/frontend", express.static(path.join(__dirname, "../frontend")));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// const paginasFront = [
//   "index",
//   "login",
//   "cadastro",
//   "quem_somos",
//   "planos",
//   "celebridades",
//   "maquiagem",
//   "cores1",
//   "looks",
//   "corpos",
//   "Unisex",
//   "unisex",
//   "idades",
//   "brecho1",
//   "modabrasileira1",
//   "formulario",
//   "perfil",
//   "meus_looks",
//   "admin",
// ];

// paginasFront.forEach((pagina) => {
//   const nomeArquivo = pagina === "index" ? "index.html" : `${pagina}.html`;
//   const rota = pagina === "index" ? "/" : `/${pagina}`;

//   app.get(rota, (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", nomeArquivo));
//   });
// });

// // --- 3. ATIVAÇÃO DOS ENDPOINTS / ROTAS ---
// app.use("/auth", loginRoute);
// app.use("/", loginRoute);

// app.use("/looks", routeLooks);
// app.use("/clientes", rotaCliente);
// app.use("/conteudo-home", conteudoHomeRoute);

// app.post("/criar-pagamento", async (req, res) => {
//   if (!stripe) {
//     return res
//       .status(503)
//       .json({ error: "Stripe não configurado no servidor." });
//   }

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Number(req.body?.amount) || 2000,
//       currency: "brl",
//       payment_method_types: ["card"],
//     });

//     return res.json({
//       sucesso: true,
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Erro ao criar pagamento Stripe:", error);
//     return res
//       .status(500)
//       .json({ error: "Não foi possível criar o pagamento." });
//   }
// });

// app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
//   res.sendStatus(204);
// });

// // --- 4. TRATAMENTO DE ERROS E ROTAS NÃO ENCONTRADAS ---
// app.use((req, res) => {
//   console.warn(`⚠️ Rota não encontrada: ${req.method} ${req.originalUrl}`);
//   res
//     .status(404)
//     .json({ error: `Rota ${req.originalUrl} não encontrada no servidor.` });
// });

// app.use((err, req, res, next) => {
//   console.error("🔥 Erro não tratado no servidor:", err);
//   res.status(500).json({ error: "Erro interno no servidor." });
// });

// // --- 5. INICIALIZAÇÃO DO SERVIDOR ---
// const PORT = process.env.PORT_SERVER || 3001;

// app.listen(PORT, () => {
//   console.log(`🚀 Servidor MontaLook rodando na porta ${PORT}`);
// });