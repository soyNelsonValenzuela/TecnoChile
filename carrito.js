let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("total-price");
const emptyCartBtn = document.getElementById("empty-cart");

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>$${product.price}</td>
    `;
    cartItems.appendChild(row);
    total += product.price;
  });

  cartTotal.innerText = total.toLocaleString();
}

function emptyCart() {
  cart = [];
  localStorage.removeItem("cart");
  renderCart();
}

emptyCartBtn.addEventListener("click", emptyCart);

renderCart();
