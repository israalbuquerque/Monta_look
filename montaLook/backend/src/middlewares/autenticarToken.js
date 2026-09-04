// import jwt from "jsonwebtoken";

// /**
//  * Middleware para autenticação e verificação do Token JWT
//  */
// export default function autenticarToken(req, res, next) {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];

//     if (!token) {
//         return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
//     }

//     // Garante o uso estrito do arquivo .env
//     const SECRET_KEY = process.env.JWT_SECRET;

//     jwt.verify(token, SECRET_KEY, (err, usuarioDecodificado) => {
//         if (err) {
//             return res.status(403).json({ error: "Token inválido ou expirado." });
//         }

//         req.usuario = usuarioDecodificado;
//         next();
//     });
// }

import jwt from "jsonwebtoken"; // Importa a biblioteca para verificação e decodificação do token JWT

/**
 * Middleware para autenticação e verificação do Token JWT
 */
export default function autenticarToken(req, res, next) { // Exporta a função middleware que intercepta as requisições
    // Captura o cabeçalho 'authorization' enviado na requisição HTTP (ex: "Bearer eyJhbGci...")
    const authHeader = req.headers["authorization"];
    // Extrai apenas a string do token removendo a palavra 'Bearer ' do início (caso o cabeçalho exista)
    const token = authHeader && authHeader.split(" ")[1];

    // Valida se o token foi fornecido na requisição
    if (!token) {
        return res.status(401).json({ error: "Acesso negado. Token não fornecido." }); // Retorna erro 401 (Não Autorizado)
    }

    // Obtém a chave secreta de assinatura diretamente do arquivo de variáveis de ambiente (.env)
    const SECRET_KEY = process.env.JWT_SECRET;

    // Valida a integridade e o prazo de expiração do token usando a chave secreta
    jwt.verify(token, SECRET_KEY, (err, usuarioDecodificado) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido ou expirado." }); // Retorna erro 403 (Proibido) se o token for falso ou expirar
        }

        // Armazena os dados decodificados do usuário dentro do próprio objeto da requisição (req.usuario)
        req.usuario = usuarioDecodificado;
        
        next(); // Autoriza a execução e passa o controle para a próxima função/rota da aplicação
    });
}