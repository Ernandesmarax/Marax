import pool from "./db.js";
import BaseRepository from "./BaseRepository.js";

class CarsRepository extends BaseRepository {
  async create(car) {
    const { description, model, year, km_driven, price, fotos } = car;

    try {
      // Inicia uma transação
      await pool.query("BEGIN");

      // Insere o carro na tabela `cars`
      const carQuery = `
        INSERT INTO cars (description, model, year, km_driven, price)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const carResult = await pool.query(carQuery, [
        description,
        model,
        year,
        km_driven,
        price,
      ]);
      const newCar = carResult.rows[0];

      // Insere as imagens na tabela `carsimgs`
      if (fotos && fotos.length > 0) {
        const imgQuery = `
          INSERT INTO carsimgs (car_id, img_data)
          VALUES ($1, $2);
        `;
        for (const foto of fotos) {
          // Converte a imagem para um buffer
          const imgBuffer = Buffer.from(foto, "base64");
          await pool.query(imgQuery, [newCar.id, imgBuffer]);
        }
      }

      // Finaliza a transação
      await pool.query("COMMIT");

      return newCar;
    } catch (error) {
      // Em caso de erro, desfaz a transação
      await pool.query("ROLLBACK");
      throw error;
    }
  }

  async getLatest() {
    try {
      const queryText = `
        SELECT c.*, array_agg(ci.img_data) AS fotos
        FROM cars c
        LEFT JOIN carsimgs ci ON c.id = ci.car_id
        GROUP BY c.id
        ORDER BY c.id DESC
        LIMIT 1;
      `;
      const result = await pool.query(queryText);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async getCarImages(carId) {
    try {
      const query = `
        SELECT img_data
        FROM carsimgs
        WHERE car_id = $1;
      `;
      const result = await pool.query(query, [carId]);

      // Converte os dados binários para base64 (se necessário)
      const images = result.rows.map((row) => ({
        img_data: row.img_data.toString("base64"), // Certifique-se de que é uma string base64
      }));

      return images;
    } catch (error) {
      throw error;
    }
  }
}

export default CarsRepository;
