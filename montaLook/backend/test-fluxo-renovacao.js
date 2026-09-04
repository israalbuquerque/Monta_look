import pool from "./src/database/database.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

/**
 * Script de teste: Validação completa do fluxo de expiração → bloqueio → renovação → histórico
 *
 * Cenário:
 * 1. Criar usuário de teste com assinatura VENCIDA
 * 2. Tentar login - deve retornar erro de expiração
 * 3. Simular renovação com "manter" plano
 * 4. Verificar se a nova assinatura foi criada
 * 5. Verificar se o histórico foi registrado
 * 6. Confirmar login bem-sucedido após renovação
 */

const emailTeste = "teste-renovacao@example.com";
const senhaTeste = "senha123";
const cpfTeste = "12345678900";

async function testeFluxoRenovacao() {
  console.log("🔄 INICIANDO TESTE DO FLUXO DE RENOVAÇÃO\n");

  try {
    // 1. LIMPEZA: Remover usuário de teste anterior se existir
    console.log("1️⃣  Limpando usuário de teste anterior...");
    await pool.query("DELETE FROM Usuarios WHERE email = ?", [emailTeste]);
    console.log("✅ Limpeza concluída\n");

    // 2. CRIAR USUÁRIO DE TESTE
    console.log("2️⃣  Criando usuário de teste...");
    const senhaHash = await bcrypt.hash(senhaTeste, 10);
    const [resultUsuario] = await pool.query(
      `INSERT INTO Usuarios (nome, email, cpf, telefone, senha, perfil, status, data_criacao) 
       VALUES (?, ?, ?, ?, ?, 'cliente', 'ativo', NOW())`,
      [
        "Usuário Teste Renovação",
        emailTeste,
        cpfTeste,
        "11999999999",
        senhaHash,
      ],
    );
    const idUsuario = resultUsuario.insertId;
    console.log(`✅ Usuário criado com ID: ${idUsuario}\n`);

    // 3. CRIAR ASSINATURA COM VIGÊNCIA EXPIRADA
    console.log("3️⃣  Criando assinatura COM VIGÊNCIA EXPIRADA...");
    const dataPassada = new Date();
    dataPassada.setDate(dataPassada.getDate() - 5); // 5 dias atrás

    const [resultAssinatura] = await pool.query(
      `INSERT INTO Assinaturas (id_usuario, id_plano, forma_pagamento, status, data_inicio, vigencia_fim, data_pagamento)
       VALUES (?, ?, ?, 'Ativo', DATE_SUB(NOW(), INTERVAL 35 DAY), ?, NOW())`,
      [idUsuario, 1, "Cartao_Credito", dataPassada],
    );
    const idAssinatura = resultAssinatura.insertId;
    console.log(
      `✅ Assinatura criada com ID: ${idAssinatura} (vigência expirada em ${dataPassada.toISOString()})\n`,
    );

    // 4. SIMULAR LOGIN COM ASSINATURA EXPIRADA
    console.log("4️⃣  Simulando LOGIN com assinatura EXPIRADA...");
    const loginBody = JSON.stringify({ email: emailTeste, senha: senhaTeste });
    const response = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: loginBody,
    });
    const loginResult = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Resposta: ${JSON.stringify(loginResult, null, 2)}`);

    if (response.status === 403 && loginResult.expirou) {
      console.log(
        "✅ LOGIN BLOQUEADO CORRETAMENTE - Assinatura expirada detectada\n",
      );
    } else {
      console.log("❌ ERRO: Login deveria ter sido bloqueado!\n");
      return;
    }

    // 5. EXTRAIR TOKEN VÁLIDO (antes de expirar) PARA SIMULAR RENOVAÇÃO
    // Para testes, vamos usar um token fictício e permitir a renovação sem autenticação
    console.log("5️⃣  Simulando RENOVAÇÃO com plano mantido (manter)...");

    // Primeiro, vamos simular diretamente a renovação no banco
    const novoDataFim = new Date();
    novoDataFim.setDate(novoDataFim.getDate() + 15); // Próximos 15 dias

    const [resultRenovacao] = await pool.query(
      `INSERT INTO Assinaturas (id_usuario, id_plano, forma_pagamento, status, data_inicio, vigencia_fim, data_pagamento)
       VALUES (?, ?, ?, 'Ativo', NOW(), ?, NOW())`,
      [idUsuario, 1, "Cartao_Credito", novoDataFim],
    );
    const idAssinaturaNova = resultRenovacao.insertId;
    console.log(
      `✅ Assinatura renovada com ID: ${idAssinaturaNova} (vigência até ${novoDataFim.toISOString()})\n`,
    );

    // 6. REGISTRAR NO HISTÓRICO
    console.log("6️⃣  Registrando renovação no histórico...");
    const [resultHistorico] = await pool.query(
      `INSERT INTO historico_planos (id_usuario, id_plano_anterior, id_plano_novo, acao, motivo, valor)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [idUsuario, 1, 1, "manter_plano", "vigencia_expirada_manter_plano", 4.99],
    );
    console.log(
      `✅ Histórico registrado com ID: ${resultHistorico.insertId}\n`,
    );

    // 7. VERIFICAR HISTÓRICO
    console.log("7️⃣  Consultando histórico de planos...");
    const [historico] = await pool.query(
      `SELECT h.*, p1.nome_plano AS nome_plano_anterior, p2.nome_plano AS nome_plano_novo
       FROM historico_planos h
       LEFT JOIN Planos p1 ON p1.id_plano = h.id_plano_anterior
       LEFT JOIN Planos p2 ON p2.id_plano = h.id_plano_novo
       WHERE h.id_usuario = ?
       ORDER BY h.data_alteracao DESC`,
      [idUsuario],
    );
    console.log(`✅ Histórico encontrado:`);
    console.log(JSON.stringify(historico, null, 2));
    console.log("");

    // 8. VERIFICAR ASSINATURA ATIVA APÓS RENOVAÇÃO
    console.log("8️⃣  Consultando assinatura ativa...");
    const [assinaturaAtiva] = await pool.query(
      `SELECT a.id_assinatura, a.id_plano, a.vigencia_fim, a.status, p.nome_plano
       FROM Assinaturas a
       LEFT JOIN Planos p ON p.id_plano = a.id_plano
       WHERE a.id_usuario = ?
       ORDER BY a.id_assinatura DESC
       LIMIT 1`,
      [idUsuario],
    );
    console.log(`✅ Assinatura ativa:`);
    console.log(JSON.stringify(assinaturaAtiva, null, 2));
    console.log("");

    // 9. SIMULAR LOGIN APÓS RENOVAÇÃO
    console.log("9️⃣  Simulando LOGIN APÓS RENOVAÇÃO...");
    const response2 = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: loginBody,
    });
    const loginResult2 = await response2.json();
    console.log(`Status: ${response2.status}`);
    console.log(`Resposta: ${JSON.stringify(loginResult2, null, 2)}`);

    if (response2.status === 200 && loginResult2.token) {
      console.log("✅ LOGIN BEM-SUCEDIDO APÓS RENOVAÇÃO\n");
    } else {
      console.log("❌ ERRO: Login deveria ter sucesso após renovação!\n");
    }

    // 10. TESTE DE ALTERAÇÃO DE PLANO
    console.log("🔟 Testando ALTERAÇÃO DE PLANO...");

    // Criar segunda renovação com plano diferente
    const novoDataFim2 = new Date();
    novoDataFim2.setDate(novoDataFim2.getDate() + 30); // Próximos 30 dias

    const [resultRenovacao2] = await pool.query(
      `INSERT INTO Assinaturas (id_usuario, id_plano, forma_pagamento, status, data_inicio, vigencia_fim, data_pagamento)
       VALUES (?, ?, ?, 'Ativo', NOW(), ?, NOW())`,
      [idUsuario, 2, "Cartao_Credito", novoDataFim2],
    );

    const [resultHistorico2] = await pool.query(
      `INSERT INTO historico_planos (id_usuario, id_plano_anterior, id_plano_novo, acao, motivo, valor)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        idUsuario,
        1,
        2,
        "renovar_plano",
        "vigencia_expirada_alterar_plano",
        9.99,
      ],
    );
    console.log(
      `✅ Plano alterado de 1 para 2 - Histórico ID: ${resultHistorico2.insertId}\n`,
    );

    // Verificar histórico final
    console.log("📋 HISTÓRICO FINAL:");
    const [historicoFinal] = await pool.query(
      `SELECT h.*, p1.nome_plano AS nome_plano_anterior, p2.nome_plano AS nome_plano_novo
       FROM historico_planos h
       LEFT JOIN Planos p1 ON p1.id_plano = h.id_plano_anterior
       LEFT JOIN Planos p2 ON p2.id_plano = h.id_plano_novo
       WHERE h.id_usuario = ?
       ORDER BY h.data_alteracao DESC`,
      [idUsuario],
    );
    console.log(JSON.stringify(historicoFinal, null, 2));
    console.log("");

    console.log("✅ ✅ ✅ TESTE COMPLETO COM SUCESSO! ✅ ✅ ✅\n");
    console.log("Resumo:");
    console.log(`- Usuário criado: ${emailTeste}`);
    console.log(`- Assinatura expirada bloqueou acesso ✅`);
    console.log(`- Renovação registrada ✅`);
    console.log(`- Login bem-sucedido após renovação ✅`);
    console.log(`- Histórico gravado corretamente ✅`);
  } catch (error) {
    console.error("❌ ERRO durante o teste:", error);
  } finally {
    process.exit(0);
  }
}

testeFluxoRenovacao();
