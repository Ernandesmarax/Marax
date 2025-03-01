import express from "express";
import CarsRepository from "../repository/CarsRepository.js";

const router = express.Router();

// Rota que busca todos os carros já cadastrado, para serem exibidos na página
router.get("/", async (req, res) => {
  try {
    const cars = await new CarsRepository().getAll("cars");
    res.json(cars);
  } catch (error) {
    console.error("Erro ao buscar carros:", error);
    res.status(500).json({ message: "Erro interno ao buscar carros." });
  }
});

// Rota para buscar as imagens de um carro específico
router.get("/carsimgs/:id", async (req, res) => {
  try {
    const carId = req.params.id;
    const images = await new CarsRepository().getCarImages(carId);
    res.json(images);
  } catch (error) {
    console.error("Erro ao buscar imagens do carro:", error);
    res
      .status(500)
      .json({ message: "Erro interno ao buscar imagens do carro." });
  }
});

// Rota para cadastrar um novo carro e associar imagens a ele
router.post("/", async (req, res) => {
  try {
    console.log("Recebendo requisição:", req.body); // Log dos dados recebidos

    const {
      description: descricao,
      model: modelo,
      year: ano,
      km_driven: km,
      price: preco,
      fotos,
    } = req.body;

    // Validação dos campos
    if (!descricao || !modelo || !ano || !km || !preco || !fotos) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    // Convertendo para os nomes das colunas do banco
    const car = {
      description: descricao,
      model: modelo,
      year: ano,
      km_driven: km,
      price: preco,
      fotos: fotos.split(",").map((url) => url.trim()),
    };

    const newCar = await new CarsRepository().create(car);

    res
      .status(201)
      .json({ message: "Carro cadastrado com sucesso!", car: newCar });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    res.status(500).json({
      message: "Erro interno ao cadastrar o carro.",
      error: error.message,
    });
  }
});

router.get("/latest", async (req, res) => {
  try {
    const latestCar = await new CarsRepository().getLatest();
    res.status(200).json(latestCar);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar o último veículo.",
      error: error.message,
    });
  }
});

export default router;
