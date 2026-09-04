import pool from "../database/database.js";

class TokenModel {
    async createToken({ id_usuario, token, expires_at }) {
        const [result] = await pool.query(
            "INSERT INTO tokens_sessao (id_usuario, token, expires_at) VALUES (?, ?, ?)",
            [id_usuario, token, expires_at]
        );
        return result;
    }

    async selectByToken(token) {
        const [rows] = await pool.query(
            "SELECT * FROM tokens_sessao WHERE token = ?",
            [token]
        );
        return rows;
    }

    async deleteToken(token) {
        const [result] = await pool.query(
            "DELETE FROM tokens_sessao WHERE token = ?",
            [token]
        );
        return result;
    }
}

export default new TokenModel();