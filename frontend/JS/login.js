document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const surname = document.getElementById("User").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:4000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surname, password }),
    });

    const result = await response.json();
    if (response.ok) {
      localStorage.setItem("authenticated", "true");
      window.location.href = "/frontend/cadastro.html";
    } else {
      document.getElementById("message").textContent =
        result.message || "Erro no login.";
    }
  } catch (error) {
    document.getElementById("message").textContent =
      "Erro ao conectar ao servidor.";
  }
});
