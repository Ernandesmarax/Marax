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

    // Usar Promise.all para garantir que todas as requisições de imagens sejam concluídas
    const carrosComImagens = await Promise.all(
      carros.map(async (carro) => {
        const imagensResponse = await fetch(
          `http://localhost:4000/cars/carsimgs/${carro.id}`
        );
        const imagens = imagensResponse.ok ? await imagensResponse.json() : [];
        return { ...carro, imagens };
      })
    );

    carrosComImagens.forEach((carro) => {
      const novoAnuncio = `
        <div class="boxs">
          <div class="carrossel-imgs">
            <div class="box--imgs">
              ${carro.imagens
                .map(
                  (imagem, index) =>
                    `<img ${
                      index === 0 ? "src" : "data-src"
                    }="data:image/jpeg;base64,${imagem.img_data}" alt="Carro ${
                      carro.id
                    }">`
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
              <p>${carro.km_driven}km</p>
            </div>
            <p class="preco">R$ ${carro.price.toLocaleString("pt-BR")}</p>
          </div>
        </div>
      `;

      carrosselInner.insertAdjacentHTML("beforeend", novoAnuncio);
    });

    // Inicializar os carrosséis de imagens após os elementos serem adicionados ao DOM
    document.querySelectorAll(".carrossel-imgs").forEach((carrossel) => {
      const carrosselImagens = carrossel.querySelector(".box--imgs");
      const imagens = carrosselImagens.querySelectorAll("img"); // Coleção de imagens
      const dotsContainer = carrossel.querySelector(".dots");
      const totalImagens = imagens.length;
      const imageWidth = imagens[0].offsetWidth;

      console.log(`Carrossel encontrado com ${imagens.length} imagens`);
      imagens.forEach((img, idx) =>
        console.log(
          `Imagem ${idx}: src="${img.src}", data-src="${img.dataset.src}"`
        )
      );

      let i = 0;

      // Criar as bolinhas dinamicamente
      imagens.forEach((_, idx) => {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (idx === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
          console.log(`Clicou na bolinha ${idx}`);
          i = idx;
          carregarImagem(i);
          updateCarrosselImagens();
        });
        dotsContainer.appendChild(dot);
      });

      const dots = dotsContainer.querySelectorAll(".dot");

      function carregarImagem(index) {
        const img = imagens[index];
        if (img) {
          console.log(
            `Imagem ${index} - Antes: src="${img.src}", data-src="${img.dataset.src}"`
          );
          if (!img.src || img.src === "") {
            img.src = img.dataset.src;
            console.log(`Imagem ${index} - Depois: src="${img.src}"`);
            img.onload = () =>
              console.log(`Imagem ${index} carregada com sucesso`);
            img.onerror = () =>
              console.error(`Erro ao carregar imagem ${index}`);
          } else {
            console.log(`Imagem ${index} já tem src definido, nada feito`);
          }
        } else {
          console.error(`Imagem ${index} não encontrada`);
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

      // Botão Próximo
      const nextBtn = carrossel.querySelector(".btn-imgs-next");
      nextBtn.addEventListener("click", () => {
        console.log("Clicou no botão Próximo");
        i = i < totalImagens - 1 ? i + 1 : 0;
        carregarImagem(i);
        updateCarrosselImagens();
      });

      // Botão Anterior
      const prevBtn = carrossel.querySelector(".btn-imgs-prev");
      prevBtn.addEventListener("click", () => {
        console.log("Clicou no botão Anterior");
        i = i > 0 ? i - 1 : totalImagens - 1;
        carregarImagem(i);
        updateCarrosselImagens();
      });

      carregarImagem(0); // Carrega a primeira imagem
    });

    // Lógica do carrossel de anúncios (mantida como estava)
    setTimeout(() => {
      const boxs = document.querySelectorAll(".boxs");
      const prevBtn = document.querySelector(".prev-btn");
      const nextBtn = document.querySelector(".next-btn");

      let index = -1;
      const totalItems = boxs.length - 1;
      const anuncioWidth = boxs[0].offsetWidth + 20;

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

      checkSingleItem();
    }, 100);
  } catch (error) {
    console.error("Erro ao carregar carros:", error);
  }
}

window.addEventListener("DOMContentLoaded", carregarCarros);
