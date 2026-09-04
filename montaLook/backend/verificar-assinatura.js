import pool from "./src/database/database.js";
import dotenv from "dotenv";

dotenv.config();

async function verificarAssinatura() {
  try {
    console.log("🔍 Verificando assinatura ID 9...\n");

    const [resultado] = await pool.query(
      "SELECT * FROM Assinaturas WHERE id_assinatura = 9",
    );

    console.log(JSON.stringify(resultado, null, 2));
  } catch (error) {
    console.error("❌ ERRO:", error);
  } finally {
    process.exit(0);
  }
}

verificarAssinatura();
