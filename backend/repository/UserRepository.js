import BaseRepository from "./BaseRepository.js";

class UserRepository extends BaseRepository {
  async getAll() {
    try {
      const results = await super.getAll("users");
      return results;
    } catch {
      throw error;
    }
  }

  async getById(id) {
    try {
      const result = await super.getById("users", id);
      return result;
    } catch {
      throw error;
    }
  }
}

export default UserRepository;
