import pool from "./src/database/database.js";
import dotenv from "dotenv";

dotenv.config();

async function criarTabelaHistorico() {
  try {
    console.log("🔨 Criando tabela historico_planos...\n");

    const sqlCriarTabela = `
    CREATE TABLE IF NOT EXISTS historico_planos (
        id_historico INT AUTO_INCREMENT PRIMARY KEY,
        id_usuario INT NOT NULL,
        id_plano_anterior INT NULL,
        id_plano_novo INT NOT NULL,
        acao VARCHAR(30) NOT NULL,
        motivo VARCHAR(100) NULL,
        valor DECIMAL(10,2) NULL,
        data_alteracao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_historico_planos_usuario FOREIGN KEY (id_usuario) REFERENCES Usuarios (id_usuario) ON DELETE CASCADE,
        CONSTRAINT fk_historico_plano_anterior FOREIGN KEY (id_plano_anterior) REFERENCES Planos (id_plano) ON DELETE SET NULL,
        CONSTRAINT fk_historico_plano_novo FOREIGN KEY (id_plano_novo) REFERENCES Planos (id_plano) ON DELETE RESTRICT
    )`;

    await pool.query(sqlCriarTabela);
    console.log("✅ Tabela historico_planos criada com sucesso!\n");

    // Verificar estrutura
    const [descricao] = await pool.query("DESCRIBE historico_planos");
    console.log("Estrutura da tabela:");
    console.log(descricao);
  } catch (error) {
    console.error("❌ ERRO:", error.message);
  } finally {
    process.exit(0);
  }
}

criarTabelaHistorico();
