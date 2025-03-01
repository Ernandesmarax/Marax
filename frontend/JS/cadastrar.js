document
  .getElementById("cadastroForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Impede o envio tradicional do formulário

    const fotosInput = document.getElementById("fotos").files;
    if (!fotosInput || fotosInput.length === 0) {
      alert("Por favor, insira pelo menos uma imagem.");
      return;
    }

    const fotos = [];
    for (let i = 0; i < fotosInput.length; i++) {
      const file = fotosInput[i];
      const base64 = await convertToBase64(file);
      fotos.push(base64);
    }

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

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });
}
