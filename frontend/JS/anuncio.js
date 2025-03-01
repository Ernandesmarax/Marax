async function carregarCarros() {
  try {
    const response = await fetch("http://localhost:4000/cars");
    if (!response.ok) {
      throw new Error("Erro ao buscar carros.");
    }

    const carros = await response.json();
    const carrosselInner = document.querySelector(".carrossel-inner");

    // Limpa o carrossel antes de adicionar novos anúncios
    carrosselInner.innerHTML = "";

    carros.forEach(async (carro) => {
      // Busca as imagens relacionadas ao carro
      const imagensResponse = await fetch(
        `http://localhost:4000/carsimgs/${carro.id}`
      );
      const imagens = imagensResponse.ok ? await imagensResponse.json() : [];
      console.log("Imagens carregadas:", imagens);

      // Cria o HTML do novo anúncio
      const novoAnuncio = `
        <div class="boxs">
          <div class="carrossel-imgs">
            <div class="box--imgs">
              ${imagens
                .map(
                  (imagem, index) =>
                    `<img ${index === 0 ? "src" : "data-src"}="${
                      imagem.url_img
                    }" alt="Carro ${carro.id}">`
                )
                .join("")}
            </div>
            <button class="btn-imgs btn-imgs-next">❯</button>
            <button class="btn-imgs btn-imgs-prev">❮</button>
            <div class="dots"></div>
          </div>
          <div class="box__descricao">
            <div class="box__descricao--style">
              <p>Descrição:</p>
              <p>${carro.description}</p>
            </div>
            <div class="box__descricao--style">
              <p>Modelo:</p>
              <p>${carro.model}</p>
            </div>
            <div class="box__descricao--style">
              <p>Ano:</p>
              <p>${carro.year}</p>
            </div>
            <div class="box__descricao--style">
              <p>Km Rodado:</p>
              <p>${carro.km_driven} km</p>
            </div>
            <p class="preco">R$ ${carro.price.toLocaleString("pt-BR")}</p>
          </div>
        </div>
      `;

      // Adiciona o novo anúncio ao carrossel
      carrosselInner.insertAdjacentHTML("beforeend", novoAnuncio);
    });

    // Aguarda o carregamento dos anúncios antes de manipular o DOM
    setTimeout(() => {
      const boxs = document.querySelectorAll(".boxs");
      const prevBtn = document.querySelector(".prev-btn");
      const nextBtn = document.querySelector(".next-btn");

      let index = -1;
      const totalItems = boxs.length - 1;
      const anuncioWidth = boxs[0].offsetWidth + 20; // Agora boxs[0] existe

      function updateCarrosselAnuncios() {
        carrosselInner.style.transform = `translateX(${
          -index * anuncioWidth
        }px)`;
      }

      function checkSingleItem() {
        if (boxs.length < 3) {
          carrosselInner.style.transform = `translateX(33.33%)`;
          prevBtn.disabled = true;
          nextBtn.disabled = true;
        } else {
          prevBtn.disabled = false;
          nextBtn.disabled = false;
        }
      }

      nextBtn.addEventListener("click", () => {
        if (boxs.length > 1) {
          if (index < totalItems - 1 || index === -1) {
            index++;
            updateCarrosselAnuncios();
          } else {
            index = -1;
            carrosselInner.style.transform = `translateX(603px)`;
          }
        }
      });

      prevBtn.addEventListener("click", () => {
        if (boxs.length > 1) {
          if (index >= 0) {
            index--;
          } else {
            index = totalItems - 1;
          }
          updateCarrosselAnuncios();
        }
      });

      // Verifica se há apenas um anúncio ao carregar a página
      checkSingleItem();
    }, 100); // Aguarda 100ms para garantir que os elementos foram renderizados
  } catch (error) {
    console.error("Erro ao carregar carros:", error);
  }
}

// Carrega os carros ao iniciar a página
window.addEventListener("DOMContentLoaded", carregarCarros);

// // Função para adicionar um novo anúncio ao carrossel
// function adicionarNovoAnuncio(car) {
//   const carrosselInner = document.querySelector(".carrossel-inner");

//   // Cria o HTML do novo anúncio
//   const novoAnuncio = `
//     <div class="boxs">
//       <div class="carrossel-imgs">
//         <div class="box--imgs">
//           ${car.fotos
//             .map(
//               (url, index) =>
//                 `<img ${index === 0 ? "src" : "data-src"}="${url}" alt="Carro ${
//                   car.id
//                 }">`
//             )
//             .join("")}
//         </div>
//         <button class="btn-imgs btn-imgs-next">❯</button>
//         <button class="btn-imgs btn-imgs-prev">❮</button>
//         <div class="dots"></div>
//       </div>
//       <div class="box__descricao">
//         <div class="box__descricao--style">
//           <p>Descrição:</p>
//           <p>${car.description}</p>
//         </div>
//         <div class="box__descricao--style">
//           <p>Modelo:</p>
//           <p>${car.model}</p>
//         </div>
//         <div class="box__descricao--style">
//           <p>Ano:</p>
//           <p>${car.year}</p>
//         </div>
//         <div class="box__descricao--style">
//           <p>Km Rodado:</p>
//           <p>${car.km_driven}km</p>
//         </div>
//         <p class="preco">R$ ${car.price}</p>
//       </div>
//     </div>
//   `;

//   // Adiciona o novo anúncio ao carrossel
//   carrosselInner.insertAdjacentHTML("beforeend", novoAnuncio);

//   // Reaplica a lógica do carrossel de imagens para o novo anúncio
//   document.querySelectorAll(".carrossel-imgs").forEach((carrossel) => {
//     // Lógica do carrossel de imagens (já existente no arquivo)
//   });
// }

// Captura os dados do novo veículo da URL
const urlParams = new URLSearchParams(window.location.search);
const newCarParam = urlParams.get("newCar");

if (newCarParam) {
  const newCar = JSON.parse(decodeURIComponent(newCarParam));
  adicionarNovoAnuncio(newCar);
}

// === CARROSSEL DE IMAGENS COM BOLINHAS === //
document.querySelectorAll(".carrossel-imgs").forEach((carrossel) => {
  const carrosselImagens = carrossel.querySelector(".box--imgs");
  const imagens = carrosselImagens.querySelectorAll("img");
  const dotsContainer = carrossel.querySelector(".dots");
  const totalImagens = imagens.length;
  const imageWidth = imagens[0].offsetWidth;

  let i = 0; // Índice separado por carrossel

  // === Criar as bolinhas === //
  imagens.forEach((_, idx) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (idx === 0) dot.classList.add("active"); // A primeira está ativa

    dot.addEventListener("click", () => {
      i = idx;
      carregarImagem(i);
      updateCarrosselImagens();
    });

    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll(".dot");

  function carregarImagem(index) {
    const img = imagens[index];
    if (img && !img.src) {
      img.src = img.dataset.src;
    }
  }

  function updateCarrosselImagens() {
    carrosselImagens.style.transform = `translateX(${-i * imageWidth}px)`;
    updateDots();
  }

  function updateDots() {
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === i);
    });
  }

  // === Botão Próximo === //
  carrossel.querySelector(".btn-imgs-next").addEventListener("click", () => {
    i = i < totalImagens - 1 ? i + 1 : 0;
    carregarImagem(i);
    updateCarrosselImagens();
  });

  // === Botão Anterior === //
  carrossel.querySelector(".btn-imgs-prev").addEventListener("click", () => {
    i = i > 0 ? i - 1 : totalImagens - 1;
    carregarImagem(i);
    updateCarrosselImagens();
  });

  // Carregar a primeira imagem no início
  carregarImagem(0);
});
