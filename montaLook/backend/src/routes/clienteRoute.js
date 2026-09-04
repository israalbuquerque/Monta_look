import express from "express";
import clienteController from "../controllers/clienteController.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import pool from "../database/database.js";
import autenticarToken from "../middlewares/autenticarToken.js";

dotenv.config();

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const rotaCliente = express.Router();

const valorPlanoPorId = {
  1: 499,
  2: 999,
  3: 1999,
};

const duracaoPlanoPorId = {
  1: 15,
  2: 30,
  3: 60,
};

const resolvePlanoId = (valor) => {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0 ? numero : null;
};

rotaCliente.get("/", clienteController.pegarTodosClientes);

const registrarHistoricoPlano = async ({
  idUsuario,
  idPlanoAnterior,
  idPlanoNovo,
  acao,
  motivo,
  valor,
}) => {
  await pool.query(
    `INSERT INTO historico_planos (id_usuario, id_plano_anterior, id_plano_novo, acao, motivo, valor)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [idUsuario, idPlanoAnterior, idPlanoNovo, acao, motivo, valor ?? null],
  );
};

const criarPagamento = async (req, res) => {
  if (!stripe) {
    return res
      .status(503)
      .json({ error: "Stripe não configurado no servidor." });
  }

  try {
    const planoId = Number(req.body?.plano);
    const pagamento = req.body?.pagamento || "Cartão Crédito";
    const amountFromBody = Number(req.body?.amount);
    const amount =
      Number.isFinite(amountFromBody) && amountFromBody > 0
        ? amountFromBody
        : valorPlanoPorId[planoId] || 499;

    const paymentMethods = pagamento === "Pix" ? ["pix"] : ["card"];

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "brl",
      payment_method_types: paymentMethods,
      metadata: {
        plano: String(planoId || req.body?.plano || "1"),
        pagamento,
      },
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount,
    });
  } catch (error) {
    console.error("Erro ao criar pagamento Stripe:", error);
    return res
      .status(500)
      .json({ error: "Não foi possível criar o pagamento." });
  }
};

rotaCliente.post("/criar-pagamento", criarPagamento);
rotaCliente.post("/criar-pagamento-pix", criarPagamento);

rotaCliente.post("/renovar", autenticarToken, async (req, res) => {
  try {
    const idUsuario = req.usuario?.id_usuario || req.usuario?.id || null;
    const planoInformado = resolvePlanoId(req.body?.plano);
    const acao = String(req.body?.acao || "alterar").toLowerCase();
    const pagamento = String(req.body?.pagamento || "Cartão Crédito");

    if (!idUsuario) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    const [assinaturaAtiva] = await pool.query(
      `SELECT id_assinatura, id_plano, vigencia_fim
       FROM Assinaturas
       WHERE id_usuario = ?
       ORDER BY id_assinatura DESC
       LIMIT 1`,
      [idUsuario],
    );

    const idPlanoAtual = assinaturaAtiva[0]?.id_plano || null;
    const idPlanoNovo =
      acao === "manter" && idPlanoAtual
        ? idPlanoAtual
        : planoInformado || idPlanoAtual || 1;

    if (!idPlanoNovo || !duracaoPlanoPorId[idPlanoNovo]) {
      return res.status(400).json({ error: "Plano inválido para renovação." });
    }

    const valorPlano = valorPlanoPorId[idPlanoNovo] || 499;
    const dataInicio = new Date();
    const vigenciaFim = new Date(dataInicio);
    vigenciaFim.setDate(vigenciaFim.getDate() + duracaoPlanoPorId[idPlanoNovo]);

    await pool.query(
      `INSERT INTO Assinaturas (id_usuario, id_plano, forma_pagamento, status, data_inicio, vigencia_fim, data_pagamento)
       VALUES (?, ?, ?, 'Ativo', NOW(), DATE_ADD(NOW(), INTERVAL ? DAY), NOW())`,
      [idUsuario, idPlanoNovo, pagamento, duracaoPlanoPorId[idPlanoNovo]],
    );

    await registrarHistoricoPlano({
      idUsuario,
      idPlanoAnterior: idPlanoAtual,
      idPlanoNovo,
      acao: acao === "manter" ? "manter_plano" : "renovar_plano",
      motivo:
        acao === "manter"
          ? "vigencia_expirada_manter_plano"
          : "vigencia_expirada_alterar_plano",
      valor: valorPlano / 100,
    });

    return res.status(200).json({
      message: "Plano renovado com sucesso.",
      id_plano: idPlanoNovo,
      vigencia_fim: vigenciaFim,
      status: "Ativo",
    });
  } catch (error) {
    console.error("Erro ao renovar plano:", error);
    return res.status(500).json({ error: "Não foi possível renovar o plano." });
  }
});

rotaCliente.get("/historico-planos", autenticarToken, async (req, res) => {
  try {
    const idUsuario = req.usuario?.id_usuario || req.usuario?.id || null;
    if (!idUsuario) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    const [historico] = await pool.query(
      `SELECT h.*, p1.nome_plano AS nome_plano_anterior, p2.nome_plano AS nome_plano_novo
       FROM historico_planos h
       LEFT JOIN Planos p1 ON p1.id_plano = h.id_plano_anterior
       LEFT JOIN Planos p2 ON p2.id_plano = h.id_plano_novo
       WHERE h.id_usuario = ?
       ORDER BY h.data_alteracao DESC`,
      [idUsuario],
    );

    return res.status(200).json(historico);
  } catch (error) {
    console.error("Erro ao carregar histórico de planos:", error);
    return res
      .status(500)
      .json({ error: "Não foi possível carregar o histórico." });
  }
});

export default rotaCliente;
