// import nodemailer from "nodemailer";

// // Configuração do transportador de e-mail (Exemplo usando Gmail)
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER, // Seu e-mail remetente
//         pass: process.env.EMAIL_PASS  // Sua "Senha de App" gerada no Google
//     }
// });

// export const enviarEmailToken = async (emailDestino, nomeUsuario, token) => {
//     const linkAcesso = `http://localhost:3001/login.html?token=${token}`;

//     const mailOptions = {
//         from: `"MontaLook" <${process.env.EMAIL_USER}>`,
//         to: emailDestino,
//         subject: "Bem-vindo ao MontaLook! Seu token de acesso",
//         html: `
//             <div style="font-family: Arial, sans-serif; color: #333;">
//                 <h2>Olá, ${nomeUsuario}!</h2>
//                 <p>Seu cadastro no <strong>MontaLook</strong> foi realizado com sucesso.</p>
//                 <p>Aqui está o seu token de primeiro acesso:</p>
//                 <div style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; word-break: break-all; font-family: monospace;">
//                     ${token}
//                 </div>
//                 <p style="margin-top: 20px;">Você também pode acessar seu perfil diretamente clicando no botão abaixo:</p>
//                 <a href="${linkAcesso}" style="background-color: #6E5F5D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
//                     Acessar Meu Perfil
//                 </a>
//             </div>
//         `
//     };

//     return await transporter.sendMail(mailOptions);
//     };

// import nodemailer from "nodemailer";

// // Transportador configurado via variáveis de ambiente
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// /**
//  * Envia e-mail com token de acesso/autenticação
//  * @param {string} emailDestino - E-mail do destinatário
//  * @param {string} nomeUsuario - Nome do usuário para personalização
//  * @param {string} token - Token JWT gerado no backend
//  */
// export const enviarEmailToken = async (emailDestino, nomeUsuario, token) => {
//     // Busca a URL base do .env ou usa localhost por padrão
//     const baseUrl = process.env.FRONTEND_URL || "http://localhost:3001";
//     const linkAcesso = `${baseUrl}/perfil.html?token=${token}`;

//     const mailOptions = {
//         from: `"MontaLook" <${process.env.EMAIL_USER}>`,
//         to: emailDestino,
//         subject: "Bem-vindo ao MontaLook! Seu token de acesso",
//         html: `
//             <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
//                 <h2 style="color: #6E5F5D; text-align: center;">Olá, ${nomeUsuario}!</h2>
//                 <p>Seu cadastro no <strong>MontaLook</strong> foi realizado com sucesso.</p>
//                 <p>Abaixo está o seu token de primeiro acesso:</p>
                
//                 <div style="background-color: #f4f4f4; padding: 12px; border-radius: 5px; word-break: break-all; font-family: monospace; text-align: center; font-weight: bold; color: #6E5F5D; margin: 15px 0;">
//                     ${token}
//                 </div>
                
//                 <p>Você também pode acessar seu perfil diretamente clicando no botão abaixo:</p>
                
//                 <div style="text-align: center; margin: 25px 0;">
//                     <a href="${linkAcesso}" style="background-color: #6E5F5D; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
//                         Acessar Meu Perfil
//                     </a>
//                 </div>

//                 <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
//                 <p style="font-size: 12px; color: #888; text-align: center;">Se você não realizou esta solicitação, por favor ignore este e-mail.</p>
//             </div>
//         `
//     };

//     try {
//         const info = await transporter.sendMail(mailOptions);
//         console.log("✅ E-mail enviado com sucesso. ID:", info.messageId);
//         return { success: true, messageId: info.messageId };
//     } catch (error) {
//         console.error("❌ Erro ao enviar e-mail via Nodemailer:", error);
//         throw error;
//     }
// };




import nodemailer from "nodemailer"; // Importa a biblioteca Nodemailer para gerenciar e disparar e-mails

// Configura o objeto transportador reutilizável utilizando credenciais salvas no ambiente (.env)
const transporter = nodemailer.createTransport({
    service: "gmail", // Define o Gmail como o provedor de serviço de e-mail
    auth: {
        user: process.env.EMAIL_USER, // Conta de e-mail do remetente obtida das variáveis de ambiente
        pass: process.env.EMAIL_PASS  // Senha de aplicativo do Google obtida do arquivo .env
    }
});

/**
 * Envia e-mail com token de acesso/autenticação
 * @param {string} emailDestino - E-mail do destinatário
 * @param {string} nomeUsuario - Nome do usuário para personalização
 * @param {string} token - Token JWT gerado no backend
 */
export const enviarEmailToken = async (emailDestino, nomeUsuario, token) => { // Exporta a função assíncrona para envio do e-mail
    // Busca a URL base do frontend no .env ou define a porta 3001 como padrão fallback
 // Busca a URL base do frontend no .env ou utiliza o endereço do Live Server local como padrão
// Se o Live Server abre direto na pasta do frontend:
const baseUrl = process.env.FRONTEND_URL || "http://127.0.0.1:5500/montaLook/frontend";

// Link final gerado:
const linkAcesso = `${baseUrl}/login.html?token=${token}`;

    // Define o objeto com todas as configurações e o conteúdo da mensagem
    const mailOptions = {
        from: `"MontaLook" <${process.env.EMAIL_USER}>`, // Define o nome exibido e o e-mail do remetente
        to: emailDestino, // Define o e-mail do destinatário recebido como parâmetro
        subject: "Bem-vindo ao MontaLook! Seu token de acesso", // Define o assunto exibido na caixa de entrada
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <h2 style="color: #6E5F5D; text-align: center;">Olá, ${nomeUsuario}!</h2>
                <p>Seu cadastro no <strong>MontaLook</strong> foi realizado com sucesso.</p>
                <p>Abaixo está o seu token de primeiro acesso:</p>
                
                <!-- Bloco estilizado para exibir a string pura do token JWT -->
                <div style="background-color: #f4f4f4; padding: 12px; border-radius: 5px; word-break: break-all; font-family: monospace; text-align: center; font-weight: bold; color: #6E5F5D; margin: 15px 0;">
                    ${token}
                </div>
                
                <p>Você também pode acessar seu perfil diretamente clicando no botão abaixo:</p>
                
                <!-- Botão com o link direto de acesso formatado -->
                <div style="text-align: center; margin: 25px 0;">
                    <a href="${linkAcesso}" style="background-color: #6E5F5D; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        Acessar Meu Perfil
                    </a>
                </div>

                <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
                <p style="font-size: 12px; color: #888; text-align: center;">Se você não realizou esta solicitação, por favor ignore este e-mail.</p>
            </div>
        ` // Corpo da mensagem em HTML com estilos CSS inline
    };

    try {
        // Dispara a mensagem assincronamente através do transportador do Nodemailer
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ E-mail enviado com sucesso. ID:", info.messageId); // Log de confirmação com o ID da mensagem
        return { success: true, messageId: info.messageId }; // Retorna o status de sucesso para o chamador da função
    } catch (error) {
        console.error("❌ Erro ao enviar e-mail via Nodemailer:", error); // Captura e exibe qualquer falha na conexão ou envio
        throw error; // Reassa de volta o erro para ser tratado na rota da API
    }
};