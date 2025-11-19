function verificarSesion() {
  const token = localStorage.getItem("token");
  const btnIngresar = document.querySelector(".btn-login");

  if (!btnIngresar) {
    console.warn("No se encontró el botón de ingresar");
    return;
  }

  if (token) {
    btnIngresar.textContent = "Cerrar Sesión";
    btnIngresar.href = "#";
    btnIngresar.style.cursor = "pointer";

    btnIngresar.onclick = function (e) {
      e.preventDefault();
      cerrarSesion();
    };
  } else {
    btnIngresar.textContent = "Ingresar";
    btnIngresar.href = "./html/login.html";
    btnIngresar.onclick = null;
  }
}

function cerrarSesion() {
  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Sesión cerrada exitosamente");

    window.location.reload();
  }
}

function obtenerToken() {
  return localStorage.getItem("token");
}

verificarSesion();
