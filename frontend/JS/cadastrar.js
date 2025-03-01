document
  .getElementById("cadastroForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Impede o envio tradicional do formulário

    const fotosInput = document.getElementById("fotos").value.trim();
    if (!fotosInput) {
      alert("Por favor, insira pelo menos uma URL de imagem.");
      return;
    }
    const fotos = fotosInput.split(",").map((url) => url.trim()); // Divide as URLs por vírgula e remove espaços

    const description = document.getElementById("descricao").value.trim();
    const model = document.getElementById("modelo").value.trim();
    const year = document.getElementById("ano").value.trim();
    const km_driven = document.getElementById("km").value.trim();
    const price = document.getElementById("preco").value.trim();

    if (!description || !model || !year || !km_driven || !price) {
      alert("Preencha todos os campos!");
      return;
    }

    const carData = {
      description,
      model,
      year,
      km_driven: km_driven.trim(),
      price: price.trim(),
      fotos: fotos.join(","),
    };

    try {
      const response = await fetch("http://localhost:4000/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert("Cadastro realizado com sucesso!");
      document.getElementById("cadastroForm").reset();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao tentar cadastrar.");
    }
  });

document
  .getElementById("publicarBtn")
  .addEventListener("click", async function () {
    try {
      // Busca o último veículo cadastrado no banco de dados
      const response = await fetch("http://localhost:4000/cars/latest", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar o veículo cadastrado.");
      }

      const latestCar = await response.json();

      // Redireciona para a página de anúncios com os dados do novo veículo
      window.location.href = `anuncios.html?newCar=${encodeURIComponent(
        JSON.stringify(latestCar)
      )}`;
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao publicar o veículo cadastrado.");
    }
  });
