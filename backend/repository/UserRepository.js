import BaseRepository from "./BaseRepository.js";
import pool from "./db.js";

class UserRepository extends BaseRepository {
  async getAll() {
    try {
      const results = await super.getAll("users");
      return results;
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const result = await super.getById("users", id);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getBySurname(surname) {
    try {
      const queryText = `SELECT * FROM usersadmins WHERE surname = $1`;
      const result = (await pool.query(queryText, [surname])).rows[0];
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default UserRepository;
