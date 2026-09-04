import pool from "../database/database.js";

class UserModel {
  async selectUserByEmail(email) {
    const [rows] = await pool.query(
      "SELECT id_usuario, nome, email, senha, perfil FROM Usuarios WHERE email = ? LIMIT 1",
      [email],
    );
    return rows;
  }

  async selectUserById(id) {
    const [rows] = await pool.query(
      "SELECT id_usuario, nome, email, perfil FROM Usuarios WHERE id_usuario = ? LIMIT 1",
      [id],
    );
    return rows;
  }
}

export default new UserModel();
