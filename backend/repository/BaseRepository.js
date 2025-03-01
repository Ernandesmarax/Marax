import pool from "./db.js";

class BaseRepository {
  async getAll(table) {
    try {
      const results = (await pool.query(`SELECT * FROM ${table}`)).rows;
      return results;
    } catch (error) {
      throw error;
    }
  }

  async getById(table, id) {
    try {
      const queryText = `SELECT * FROM ${table} WHERE id = $1`;
      const result = (await pool.query(queryText, [id])).rows[0];
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default BaseRepository;
