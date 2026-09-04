import pool from "../database/database.js";

class AdminUsuarioController {
  async listar(req, res) {
    try {
      const [administradores] = await pool.query(
        `SELECT id_admin, nome, email, primeiro_acesso, ativo
         FROM administradores
         ORDER BY nome, email`,
      );
      return res.json(administradores);
    } catch (error) {
      console.error("Erro ao listar administradores:", error);
      return res
        .status(500)
        .json({ error: "Não foi possível listar os administradores." });
    }
  }

  async listarClientes(req, res) {
    try {
      const [clientes] = await pool.query(
        `SELECT u.id_usuario, u.nome, u.email, u.criado_em, u.ativo,
                a.id_assinatura, a.id_plano, a.forma_pagamento, a.status AS status_pagamento,
                a.data_inicio, a.data_pagamento,
                p.nome_plano, p.valor, p.dias_duracao
         FROM Usuarios u
         LEFT JOIN Assinaturas a ON a.id_assinatura = (
           SELECT a2.id_assinatura
           FROM Assinaturas a2
           WHERE a2.id_usuario = u.id_usuario
           ORDER BY a2.id_assinatura DESC
           LIMIT 1
         )
         LEFT JOIN Planos p ON p.id_plano = a.id_plano
         WHERE u.perfil <> 'admin'
         ORDER BY u.nome, u.email`,
      );
      return res.json(clientes);
    } catch (error) {
      console.error("Erro ao listar clientes para administração:", error);
      return res
        .status(500)
        .json({ error: "Não foi possível listar os clientes." });
    }
  }

  async desativarCliente(req, res) {
    try {
      const idUsuario = Number(req.params.id);
      if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
        return res.status(400).json({ error: "Cliente inválido." });
      }

      const [resultado] = await pool.query(
        "UPDATE Usuarios SET ativo = 0 WHERE id_usuario = ? AND perfil <> 'admin'",
        [idUsuario],
      );

      if (!resultado.affectedRows) {
        return res
          .status(404)
          .json({ error: "Cliente não encontrado ou já desativado." });
      }

      return res.json({ message: "Cliente desativado com sucesso." });
    } catch (error) {
      console.error("Erro ao desativar cliente:", error);
      return res
        .status(500)
        .json({ error: "Não foi possível desativar o cliente." });
    }
  }

  async ativarCliente(req, res) {
    try {
      const idUsuario = Number(req.params.id);
      if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
        return res.status(400).json({ error: "Cliente inválido." });
      }

      const [resultado] = await pool.query(
        "UPDATE Usuarios SET ativo = 1 WHERE id_usuario = ? AND perfil <> 'admin'",
        [idUsuario],
      );

      if (!resultado.affectedRows) {
        return res
          .status(404)
          .json({ error: "Cliente não encontrado ou já ativo." });
      }

      return res.json({ message: "Cliente ativado com sucesso." });
    } catch (error) {
      console.error("Erro ao ativar cliente:", error);
      return res
        .status(500)
        .json({ error: "Não foi possível ativar o cliente." });
    }
  }

  async criar(req, res) {
    try {
      const { nome, email } = req.body;

      if (!nome?.trim() || !email?.trim()) {
        return res.status(400).json({
          error: "Informe nome e e-mail.",
        });
      }

      const [existentes] = await pool.query(
        "SELECT id_admin FROM administradores WHERE email = ? LIMIT 1",
        [email.trim()],
      );

      if (existentes.length > 0) {
        return res.status(409).json({
          error: "Já existe um usuário com este e-mail.",
        });
      }

      const [resultado] = await pool.query(
        `INSERT INTO administradores (usuario_id, nome, email, senha, primeiro_acesso)
         VALUES (NULL, ?, ?, NULL, 1)`,
        [nome.trim(), email.trim()],
      );

      return res.status(201).json({
        message: "Administrador criado com sucesso.",
        id_admin: resultado.insertId,
      });
    } catch (error) {
      console.error("Erro ao criar administrador:", error);
      return res.status(500).json({
        error: "Não foi possível criar o administrador.",
      });
    }
  }

  async desativar(req, res) {
    try {
      const idAdmin = Number(req.params.id);
      if (!Number.isInteger(idAdmin) || idAdmin <= 0) {
        return res.status(400).json({ error: "Administrador inválido." });
      }

      const [ativos] = await pool.query(
        "SELECT COUNT(*) AS total FROM administradores WHERE ativo = 1",
      );
      if (Number(ativos[0].total) <= 1) {
        return res
          .status(409)
          .json({ error: "Mantenha pelo menos um administrador ativo." });
      }

      const [resultado] = await pool.query(
        "UPDATE administradores SET ativo = 0 WHERE id_admin = ? AND ativo = 1",
        [idAdmin],
      );
      if (!resultado.affectedRows) {
        return res
          .status(404)
          .json({ error: "Administrador não encontrado ou já desativado." });
      }

      return res.json({ message: "Administrador desativado com sucesso." });
    } catch (error) {
      console.error("Erro ao desativar administrador:", error);
      return res
        .status(500)
        .json({ error: "Não foi possível desativar o administrador." });
    }
  }

  async ativar(req, res) {
    try {
      const idAdmin = Number(req.params.id);
      if (!Number.isInteger(idAdmin) || idAdmin <= 0) {
        return res.status(400).json({ error: "Administrador inválido." });
      }

      const [resultado] = await pool.query(
        "UPDATE administradores SET ativo = 1 WHERE id_admin = ? AND ativo = 0",
        [idAdmin],
      );
      if (!resultado.affectedRows) {
        return res
          .status(404)
          .json({ error: "Administrador não encontrado ou já ativo." });
      }

      return res.json({ message: "Administrador ativado com sucesso." });
    } catch (error) {
      console.error("Erro ao ativar administrador:", error);
      return res
        .status(500)
        .json({ error: "Não foi possível ativar o administrador." });
    }
  }
}

export default new AdminUsuarioController();
