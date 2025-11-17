const API_URL = "http://localhost:8080/api";

window.onload = function () {
  loadCart();
};

function getToken() {
  return localStorage.getItem("token");
}

// Cargar productos del carrito
function loadCart() {
  const token = getToken();

  fetch(`${API_URL}/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const cart = data.payload.cart;
      showCart(cart);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al cargar el carrito");
    });
}

// Mostrar productos en la página
function showCart(cart) {
  const cartItems = document.getElementById("cartItems");
  const totalPrice = document.getElementById("totalPrice");

  cartItems.innerHTML = "";

  if (cart.items.length === 0) {
    cartItems.innerHTML =
      '<p style="text-align:center; color: black;">Tu carrito está vacío</p>';
    totalPrice.textContent = "0";
    return;
  }

  cart.items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";

    const imagePath = `../img/products/${item.product.image}`;

    div.innerHTML = `
      <img src="${imagePath}" alt="${item.product.name}">
      <div class="item-info">
        <h3>${item.product.name}</h3>
        <p>Precio: ${item.price}</p>
      </div>
      <div class="quantity">
        <button onclick="changeQuantity('${item.product._id}', ${
      item.quantity - 1
    })">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity('${item.product._id}', ${
      item.quantity + 1
    })">+</button>
      </div>
      <button class="btn-remove" onclick="removeProduct('${
        item.product._id
      }')">Eliminar</button>
    `;
    cartItems.appendChild(div);
  });

  totalPrice.textContent = cart.totalPrice;
}

// Cambiar cantidad de un producto
function changeQuantity(productId, newQuantity) {
  if (newQuantity < 1) return;

  const token = getToken();

  fetch(`${API_URL}/cart/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity: newQuantity }),
  })
    .then((response) => response.json())
    .then((data) => {
      showCart(data.payload.cart);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Eliminar producto del carrito
function removeProduct(productId) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Se eliminará este producto del carrito",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e74c3c",
    cancelButtonColor: "#95a5a6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      const token = getToken();

      fetch(`${API_URL}/cart/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          showCart(data.payload.cart);
          Swal.fire(
            "¡Eliminado!",
            "El producto fue eliminado del carrito",
            "success"
          );
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire("Error", "No se pudo eliminar el producto", "error");
        });
    }
  });
}

// Finalizar compra
function checkout() {
  Swal.fire({
    title: "¿Finalizar compra?",
    text: "Se procesará tu pedido",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#27ae60",
    cancelButtonColor: "#95a5a6",
    confirmButtonText: "Sí, comprar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      const token = getToken();

      fetch(`${API_URL}/cart/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            Swal.fire(
              "¡Compra exitosa!",
              "Tu pedido ha sido procesado",
              "success"
            );
            loadCart();
          } else {
            Swal.fire("Error", data.message, "error");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire("Error", "No se pudo finalizar la compra", "error");
        });
    }
  });
}
