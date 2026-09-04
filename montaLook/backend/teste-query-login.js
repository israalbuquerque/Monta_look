import pool from "./src/database/database.js";
import dotenv from "dotenv";

dotenv.config();

async function testeQueryLogin() {
  try {
    console.log("🔍 Testando query do loginController...\n");

    const idUsuario = 15;

    console.log("Query executada:");
    console.log(`SELECT a.id_assinatura, a.status, a.data_inicio, a.vigencia_fim, a.id_plano, p.nome_plano, p.valor
     FROM Assinaturas a
     LEFT JOIN Planos p ON p.id_plano = a.id_plano
     WHERE a.id_usuario = ${idUsuario} AND a.status IN ('Ativo', 'Ativa', 'Trial')
     ORDER BY a.id_assinatura DESC
     LIMIT 1`);
    console.log("");

    const [assinaturas] = await pool.query(
      `SELECT a.id_assinatura, a.status, a.data_inicio, a.vigencia_fim, a.id_plano, p.nome_plano, p.valor
       FROM Assinaturas a
       LEFT JOIN Planos p ON p.id_plano = a.id_plano
       WHERE a.id_usuario = ? AND a.status IN ('Ativo', 'Ativa', 'Trial')
       ORDER BY a.id_assinatura DESC
       LIMIT 1`,
      [idUsuario],
    );

    console.log("Resultado da query:");
    console.log(JSON.stringify(assinaturas, null, 2));

    if (assinaturas.length > 0) {
      const assinatura = assinaturas[0];
      console.log("\nCampos da assinatura:");
      console.log("- id_assinatura:", assinatura.id_assinatura);
      console.log("- status:", assinatura.status);
      console.log("- data_inicio:", assinatura.data_inicio);
      console.log("- vigencia_fim:", assinatura.vigencia_fim);
      console.log("- id_plano:", assinatura.id_plano);
      console.log("- nome_plano:", assinatura.nome_plano);
      console.log("- valor:", assinatura.valor);

      if (assinatura.vigencia_fim) {
        const dataVigencia = new Date(assinatura.vigencia_fim);
        const agora = new Date();
        console.log("\nComparação de datas:");
        console.log("- vigencia_fim:", dataVigencia);
        console.log("- agora:", agora);
        console.log("- expirou?", dataVigencia < agora);
      } else {
        console.log("\n❌ vigencia_fim é null/undefined!");
      }
    }
  } catch (error) {
    console.error("❌ ERRO:", error);
  } finally {
    process.exit(0);
  }
}

testeQueryLogin();
