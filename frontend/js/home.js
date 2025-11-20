document.addEventListener("DOMContentLoaded", () => {
  const productosGrid = document.getElementById("productos-grid");
  const API_URL = "http://localhost:8080/api/products";


  function mostrarLoading() {
    productosGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p style="color: var(--text-light); font-size: 1.2rem;">Cargando productos...</p>
            </div>
        `;
  }

  async function cargarProductos() {
    mostrarLoading();

    try {
      const token = obtenerToken();
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(API_URL, { headers });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      const productos = data.payload?.products || data.products || data;

      if (!productos || productos.length === 0) {
        productosGrid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                        <p style="color: var(--text-light); font-size: 1.2rem;">No hay productos disponibles</p>
                    </div>
                `;
        return;
      }

      renderizarProductos(productos);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      productosGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <p style="color: #ff0055; font-size: 1.2rem;">Error al cargar los productos</p>
                    <p style="color: var(--text-light); margin-top: 1rem;">${err.message}</p>
                    <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.8rem 1.5rem; background: var(--primary-color); color: var(--bg-dark); border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        Reintentar
                    </button>
                </div>
            `;
    }
  }

  function renderizarProductos(productos) {
    productosGrid.innerHTML = "";

    productos.forEach((prod) => {
      if (prod.isActive === false) return;

      const card = crearTarjetaProducto(prod);
      productosGrid.appendChild(card);
    });

    activarBotonesCarrito();
  }

  function crearTarjetaProducto(prod) {
    const card = document.createElement("div");
    card.classList.add("producto-card");

    let imagenUrl;

    if (prod.image && prod.image !== "default-product.jpg") {
      imagenUrl = `./img/products/${prod.image}`;
    }

    let badge = "";
    if (prod.stock === 0) {
      badge =
        '<span class="producto-badge" style="background: #666;">Sin stock</span>';
    } else if (prod.stock < 5) {
      badge = '<span class="producto-badge hot">¡Últimas unidades!</span>';
    } else if (prod.stock >= 20) {
      badge = '<span class="producto-badge">Disponible</span>';
    }

    card.innerHTML = `
            <div class="producto-image">
                <img src="${imagenUrl}" 
                     alt="${prod.name}"
                ${badge}
            </div>

            <div class="producto-info">
                <h3 class="producto-nombre">${prod.name}</h3>

                <p class="producto-descripcion">
                    ${prod.description}
                </p>

                <p class="producto-stock" style="color: ${
                  prod.stock > 5
                    ? "var(--text-light)"
                    : prod.stock > 0
                    ? "#ffa500"
                    : "#ff0055"
                }; font-size: 0.9rem; margin-bottom: 1rem;">
                    Stock disponible: <strong>${prod.stock}</strong> unidades
                </p>

                <div class="producto-footer">
                    <span class="producto-precio">$${prod.price.toFixed(
                      2
                    )}</span>

                    <button class="btn-add-cart" 
                            data-id="${prod._id}" 
                            ${
                              prod.stock === 0
                                ? 'disabled style="opacity: 0.5; cursor: not-allowed;"'
                                : ""
                            }>
                        ${prod.stock === 0 ? "Sin stock" : "Agregar"}
                    </button>
                </div>
            </div>
        `;

    return card;
  }

  function activarBotonesCarrito() {
    document.querySelectorAll(".btn-add-cart").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();

        const productId = btn.getAttribute("data-id");

        if (!productId) {
          console.error("ID de producto no encontrado");
          return;
        }

        try {
          await agregarAlCarrito(productId);

          const textoOriginal = btn.innerHTML;
          btn.textContent = "✓ Agregado";
          btn.style.background = "#00ff88";
          btn.style.color = "#000";

          setTimeout(() => {
            btn.innerHTML = textoOriginal;
            btn.style.background = "";
            btn.style.color = "";
          }, 1500);
        } catch (error) {
          console.error("Error al agregar al carrito:", error);
          alert("Error al agregar el producto. Por favor intenta nuevamente.");
        }
      });
    });
  }

  async function agregarAlCarrito(productId) {
    const token = obtenerToken();

    if (!token) {
      alert("Debes iniciar sesión para agregar productos al carrito");
      window.location.href = "./html/login.html";
      return;
    }

    const response = await fetch("http://localhost:8080/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: productId,
        quantity: 1,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al agregar al carrito");
    }

    actualizarContadorCarrito();

    return await response.json();
  }

  async function actualizarContadorCarrito() {
    const cartCount = document.getElementById("cart-count");
    const token = obtenerToken();

    if (!token || !cartCount) return;

    try {
      const response = await fetch("http://localhost:8080/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const totalItems =
          data.payload?.items?.length || data.items?.length || 0;
        cartCount.textContent = totalItems;
      }
    } catch (error) {
      console.error("Error al actualizar contador:", error);
    }
  }

  cargarProductos();
  actualizarContadorCarrito();
});
