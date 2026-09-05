


// //esta funcionando-------------------------------------------------------------------------------

// import express from "express"; // Importa o framework Express para criar rotas e o servidor HTTP
// import nodemailer from "nodemailer"; // Importa a biblioteca para envio automatizado de e-mails
// import dotenv from "dotenv"; // Importa a biblioteca para ler variáveis de ambiente (.env)
// import cors from "cors"; // Importa o middleware para liberar requisições de origens diferentes (CORS)
// import jwt from "jsonwebtoken"; // Importa a biblioteca para gerar e validar tokens de autenticação (JWT)
// import routeLooks from "../backend/src/routes/routeLooks.js"
// import usuarioRoutes from "../backend/src/routes/loginRoute.js";
// import loginRoute from "../backend/src/routes/loginRoute.js"
// import path from "path";
// import { fileURLToPath } from "url";
// import Stripe from 'stripe';
// import cookieParser from "cookie-parser";
// import conteudoHomeRoute from "./src/routes/conteudoHomeRoute.js";
// import rotaCliente from "./src/routes/clienteRoute.js";



// const app = express(); // Inicializa a aplicação Express

// dotenv.config(); // Carrega as variáveis declaradas no arquivo .env para process.env
// app.use(cors()); // Agora funciona sem erro
// app.use(express.json());
// app.use(cookieParser());

// // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_sua_chave_secreta_aqui');
// const stripe = process.env.STRIPE_SECRET_KEY || 'sk_test_sua_chave_secreta_aqui'
//   ? new Stripe(process.env.STRIPE_SECRET_KEY)
//   : null;


// app.use((req, res, next) => {
//   res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
//   res.set("Pragma", "no-cache");
//   res.set("Expires", "0");
//   next();
// });


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 1. MIDDLEWARES DE SEGURANÇA E PARSER (DEVEM VIR ANTES DE TODAS AS ROTAS)


// // Adicione essa linha junto aos outros middlewares de arquivos estáticos
// app.use('/fotos_usuarios', express.static(path.join(__dirname, '../fotos_usuarios')));

// // Configura o parser do JSON com o limite expandido de 10MB para aceitar fotos Base64
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ limit: '10mb', extended: true }));

//  app.use("/looks", routeLooks);

// // Serve arquivos estáticos (HTML, CSS, JS)
// app.use(express.static("./"));
// app.use(express.static(path.join(__dirname, "../frontend")));

// // 2. ROTAS DA API (DEVEM VIR DEPOIS DO PARSER DE 10MB)
// app.use("/api", usuarioRoutes);

// // Configuração do transporter do Nodemailer (módulo de envio)
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });


// app.post("/clientes/criar-pagamento-cartao", loginRoute);
// app.post("/clientes/criar-pagamento-pix", loginRoute);
// app.use("/api", loginRoute);

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



// // O Chrome DevTools consulta este arquivo automaticamente durante o desenvolvimento.
// app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
//   res.sendStatus(204);
// });

// // --- 4. TRATAMENTO DE ERROS E ROTAS NÃO ENCONTRADAS ---
// // Captura requisições para rotas inexistentes
// app.use((req, res) => {
//   console.warn(`⚠️ Rota não encontrada: ${req.method} ${req.originalUrl}`);
//   res
//     .status(404)
//     .json({ error: `Rota ${req.originalUrl} não encontrada no servidor.` });
// });


// // Middleware global de tratamento de exceções
// app.use((err, req, res, next) => {
//   console.error("🔥 Erro não tratado no servidor:", err);
//   res.status(500).json({ error: "Erro interno no servidor." });
// });

// // ROTAS PARA PROCESSAMENTO DE PAGAMENTO DA STRIPE
// // =========================================================

// // Rota para pagamento com Cartão
// app.post("/clientes/criar-pagamento-cartao", async (req, res) => {
//     try {
//         const { valor } = req.body; // Valor em centavos (ex: 499 para R$ 4,99)

//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: valor || 499,
//             currency: "brl",
//             payment_method_types: ["card"],
//         });

//         res.json({ clientSecret: paymentIntent.client_secret });
//     } catch (error) {
//         console.error("Erro no pagamento por cartão:", error);
//         res.status(500).json({ error: error.message });
//     }
// });


// // Rota para pagamento com Pix
// app.post("/clientes/criar-pagamento-pix", async (req, res) => {
//     try {
//         const { valor } = req.body;

//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: valor || 499,
//             currency: "brl",
//             payment_method_types: ["pix"],
//         });

//         res.json({ clientSecret: paymentIntent.client_secret });
//     } catch (error) {
//         console.error("Erro no pagamento por Pix:", error);
//         res.status(500).json({ error: error.message });
//     }
// });
// // Teste de conexão com o servidor de e-mail ao iniciar a aplicação
// transporter.verify((error) => {
//     if (error) {
//         console.error("🔥 Erro ao autenticar no e-mail:", error);
//     } else {
//         console.log("✅ Servidor pronto para enviar e-mails!");
//     }
// });

// // Rota de Cadastro de Teste / Envio Direto de Token
// app.post("/api/usuarios", async (req, res) => {
//     try {
//         const { nome, email } = req.body;

//         if (!email) {
//             return res.status(400).json({ error: "O e-mail é obrigatório." });
//         }

//         const codigoNumerico = Math.floor(100000 + Math.random() * 900000).toString();

//         const tokenJWT = jwt.sign(
//             { email, nome },
//             process.env.JWT_SECRET || "sua_chave_secreta_aqui",
//             { expiresIn: "1h" }
//         );

//         const baseUrl = process.env.FRONTEND_URL || "http://localhost:5500/frontend";
//         const linkAcesso = `${baseUrl}/login.html?token=${tokenJWT}`;

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

// // Inicialização do Servidor HTTP
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//     console.log(`🚀 Servidor rodando na porta ${PORT}`);
// });













import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import routeLooks from "../backend/src/routes/routeLooks.js";
import usuarioRoutes from "../backend/src/routes/loginRoute.js";
import loginRoute from "../backend/src/routes/loginRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import cookieParser from "cookie-parser";
import conteudoHomeRoute from "./src/routes/conteudoHomeRoute.js";
import rotaCliente from "./src/routes/clienteRoute.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------------------------------------------
// 1. MIDDLEWARES DE SEGURANÇA E PARSER
// -------------------------------------------------------------
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// Configurações do Stripe e Nodemailer
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("🔥 Erro ao autenticar no e-mail:", error);
  } else {
    console.log("✅ Servidor pronto para enviar e-mails!");
  }
});

// -------------------------------------------------------------
// 2. SERVIR ARQUIVOS ESTÁTICOS
// -------------------------------------------------------------
app.use("/fotos_usuarios", express.static(path.join(__dirname, "../fotos_usuarios")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static("./"));
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/frontend", express.static(path.join(__dirname, "../frontend")));

// -------------------------------------------------------------
// 3. ROTAS DA API
// -------------------------------------------------------------
app.use("/looks", routeLooks);
app.use("/api", usuarioRoutes);
app.use("/api", loginRoute);
app.use("/clientes", rotaCliente);
app.use("/conteudo-home", conteudoHomeRoute);

// Rota de Cadastro e Envio de Token
app.post("/api/usuarios", async (req, res) => {
  try {
    const { nome, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "O e-mail é obrigatório." });
    }

    const codigoNumerico = Math.floor(100000 + Math.random() * 900000).toString();

    const tokenJWT = jwt.sign(
      { email, nome },
      process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "sua_chave_secreta",
      { expiresIn: "1h" }
    );

    const baseUrl = process.env.FRONTEND_URI || "http://localhost:5500/frontend";
    const linkAcesso = `${baseUrl}/login.html?token=${tokenJWT}`;

    await transporter.sendMail({
      from: `"MontaLook" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Confirme seu cadastro - MontaLook",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Olá, ${nome || "Usuário"}!</h2>
          <p>Seu código de verificação para ativar a conta é:</p>
          <h1 style="color: #6E5F5D; letter-spacing: 4px;">${codigoNumerico}</h1>
          <p style="margin-top: 20px;">Ou acesse diretamente pelo botão abaixo:</p>
          <a href="${linkAcesso}" style="background-color: #6E5F5D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Confirmar Cadastro
          </a>
        </div>
      `,
    });

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso! Verifique seu e-mail.",
      token: tokenJWT,
      codigo: codigoNumerico,
    });
  } catch (erro) {
    console.error("Erro no servidor:", erro);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// Rotas de Pagamento (Stripe)
app.post("/clientes/criar-pagamento-cartao", async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ error: "Stripe não configurado." });
    const { valor } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: valor || 499,
      currency: "brl",
      payment_method_types: ["card"],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/clientes/criar-pagamento-pix", async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ error: "Stripe não configurado." });
    const { valor } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: valor || 499,
      currency: "brl",
      payment_method_types: ["pix"],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// 4. ROTAS DO FRONTEND (HTML)
// -------------------------------------------------------------
const paginasFront = [
  "index", "login", "cadastro", "quem_somos", "planos", 
  "celebridades", "maquiagem", "cores1", "looks", "corpos", 
  "Unisex", "unisex", "idades", "brecho1", "modabrasileira1", 
  "formulario", "perfil", "meus_looks", "admin"
];

paginasFront.forEach((pagina) => {
  const nomeArquivo = pagina === "index" ? "index.html" : `${pagina}.html`;
  const rota = pagina === "index" ? "/" : `/${pagina}`;

  app.get(rota, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", nomeArquivo));
  });
});

app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.sendStatus(204);
});

// -------------------------------------------------------------
// 5. TRATAMENTO DE ERROS (SEMPRE NO FINAL DO ARQUIVO)
// -------------------------------------------------------------
app.use((req, res) => {
  console.warn(`⚠️ Rota não encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: `Rota ${req.originalUrl} não encontrada no servidor.` });
});

app.use((err, req, res, next) => {
  console.error("🔥 Erro não tratado no servidor:", err);
  res.status(500).json({ error: "Erro interno no servidor." });
});

// -------------------------------------------------------------
// 6. INICIALIZAÇÃO DO SERVIDOR
// -------------------------------------------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
