    // ========== GESTIÓN DE SESIÓN ==========
    function verificarSesion() {
        const token = localStorage.getItem("token");
        const btnIngresar = document.querySelector('.btn-login');
        
        if (!btnIngresar) {
            console.warn("No se encontró el botón de ingresar");
            return;
        }

        if (token) {
            // Usuario logueado - cambiar a "CERRAR SESIÓN"
            btnIngresar.textContent = "Cerrar Sesión";
            btnIngresar.href = "#";
            btnIngresar.style.cursor = "pointer";
            
            btnIngresar.onclick = function(e) {
                e.preventDefault();
                cerrarSesion();
            };
        } else {
            // Usuario no logueado - mostrar "INGRESAR"
            btnIngresar.textContent = "Ingresar";
            btnIngresar.href = "./html/login.html";
            btnIngresar.onclick = null;
        }
    }

    function cerrarSesion() {
        // Confirmar antes de cerrar sesión
        if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
            // Limpiar el localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            // Mostrar mensaje
            alert("Sesión cerrada exitosamente");
            
            // Recargar la página para actualizar el estado
            window.location.reload();
        }
    }

    // Obtener token del localStorage
    function obtenerToken() {
        return localStorage.getItem("token");
    }

        verificarSesion();   