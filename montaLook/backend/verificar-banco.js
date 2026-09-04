import pool from "./src/database/database.js";
import dotenv from "dotenv";

dotenv.config();

async function verificarBanco() {
  try {
    console.log("🔍 Verificando estrutura da tabela Assinaturas...\n");

    // 1. Descrever tabela
    const [descricao] = await pool.query("DESCRIBE Assinaturas");
    console.log("Estrutura da tabela Assinaturas:");
    console.log(descricao);
    console.log("");

    // 2. Verificar dados recentes
    console.log("Dados recentes da tabela Assinaturas:");
    const [dados] = await pool.query(
      "SELECT * FROM Assinaturas ORDER BY id_assinatura DESC LIMIT 3",
    );
    console.log(JSON.stringify(dados, null, 2));
    console.log("");

    // 3. Executar SELECT com vigencia_fim explicitamente
    console.log("Query SELECT com vigencia_fim explícito:");
    const [resultado] = await pool.query(
      `SELECT id_assinatura, id_usuario, id_plano, status, data_inicio, vigencia_fim FROM Assinaturas ORDER BY id_assinatura DESC LIMIT 1`,
    );
    console.log(JSON.stringify(resultado, null, 2));
  } catch (error) {
    console.error("❌ ERRO:", error);
  } finally {
    process.exit(0);
  }
}

verificarBanco();
