function showMessage(elementId, message, type) {
  const messageEl = document.getElementById(elementId);
  messageEl.textContent = message;
  messageEl.classList.add("show", type);

  setTimeout(() => {
    messageEl.classList.remove("show");
  }, 5000);
}

function checkPasswordStrength(password) {
  const strengthEl = document.getElementById("passwordStrength");

  if (!strengthEl) return;

  if (password.length === 0) {
    strengthEl.textContent = "";
    return;
  }

  if (password.length < 6) {
    strengthEl.textContent = "⚠️ Mínimo 6 caracteres";
    strengthEl.style.color = "#dc3545";
  } else if (password.length < 8) {
    strengthEl.textContent = "✓ Contraseña válida";
    strengthEl.style.color = "#ffc107";
  } else {
    strengthEl.textContent = "✓ Contraseña fuerte";
    strengthEl.style.color = "#28a745";
  }
}

async function handleRegister(event) {
  event.preventDefault();

  const username = document.getElementById("registerUsername").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  if (password.length < 6) {
    showMessage(
      "registerMessage",
      "La contraseña debe tener al menos 6 caracteres",
      "error"
    );
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok && data.status === "success") {
      showMessage(
        "registerMessage",
        data.message || "¡Registro exitoso!",
        "success"
      );

      localStorage.setItem("token", data.payload.token);
      localStorage.setItem("user", JSON.stringify(data.payload.user));

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
    } else {
      showMessage(
        "registerMessage",
        data.message || "Error al registrarse",
        "error"
      );
    }
  } catch (error) {
    console.error("Error:", error);
    showMessage(
      "registerMessage",
      "Error de conexión. Verifica tu red.",
      "error"
    );
  }
}
