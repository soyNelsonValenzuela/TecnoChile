// /js/carrito.js — carrito con cantidades, modificar, limpiar y checkout que rebaja stock
let cart = JSON.parse(localStorage.getItem("cart")) || [];

let customerData = JSON.parse(localStorage.getItem('customerData')) || null;
class Inventory {
  static STORAGE_KEY = "inventory";
  static get() {
    return JSON.parse(localStorage.getItem(Inventory.STORAGE_KEY) || "[]");
  }
  static save(products) {
    localStorage.setItem(Inventory.STORAGE_KEY, JSON.stringify(products));
  }
  static getById(id) {
    return Inventory.get().find(p => p.id === id) || null;
  }
}

function displayCustomerInfo() {
    const customerDisplay = document.getElementById('customerDisplay');
    if (customerData) {
        customerDisplay.innerHTML = `
            <div class="alert alert-info">
                <strong>Cliente:</strong> ${customerData.name} ${customerData.lastname}
            </div>
        `;
    } else {
        customerDisplay.innerHTML = `
            <div class="alert alert-warning">
                <strong>⚠️ No hay información de cliente</strong><br>
                <small>Para realizar una compra, por favor ingrese sus datos <a href="user.html">AQUÍ</a>.</small>
            </div>
        `;
    }
}

class CartItem {
  constructor(productId, name, price, qty) {
    this.productId = productId;
    this.name = name;
    this.price = price;
    this.qty = qty;
  }
  get subtotal() { return this.qty * this.price; }
}

class Cart {
  static STORAGE_KEY = "cart";
  static get() {
    const raw = JSON.parse(localStorage.getItem(Cart.STORAGE_KEY) || "[]");
    return raw.map(i => new CartItem(i.productId, i.name, i.price, i.qty));
  }
  static save(items) { localStorage.setItem(Cart.STORAGE_KEY, JSON.stringify(items)); }
  static clear() { localStorage.removeItem(Cart.STORAGE_KEY); }
}

function showToast(message, type = 'info') {
  const toastContainer = document.createElement('div');
  toastContainer.className = 'position-fixed top-0 end-0 p-3';
  toastContainer.style.zIndex = '1050';
  const toastId = 'toast-' + Date.now();
  toastContainer.innerHTML = `
    <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>`;
  document.body.appendChild(toastContainer);
  const toastEl = new bootstrap.Toast(document.getElementById(toastId), { delay: 2000 });
  toastEl.show();
  setTimeout(() => toastContainer.remove(), 2200);
}

function formatCurrency(n) {
  return "$" + (n || 0).toLocaleString();
}

function updateCartCounter() {
  const cart = Cart.get();
  const cartIcon = document.getElementById('cartIcon');
  if (!cartIcon) return;
  const existingCounter = cartIcon.querySelector('.cart-counter');
  if (existingCounter) existingCounter.remove();
  if (cart.length > 0) {
    const counter = document.createElement('span');
    counter.className = 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-counter';
    counter.style.fontSize = '0.7rem';
    counter.textContent = cart.reduce((a,x)=>a+x.qty,0);
    cartIcon.style.position = 'relative';
    cartIcon.appendChild(counter);
  }
}

function renderCart() {
  const itemsContainer = document.getElementById("cart-items");
  const totalEl = document.getElementById("total-price");
  const emptyMsg = document.getElementById("emptyCartMessage");
  const tableContainer = document.getElementById("cartTableContainer");
  const itemCount = document.getElementById("itemCount");

  const items = Cart.get();

  if (items.length === 0) {
    emptyMsg.style.display = "block";
    tableContainer.style.display = "none";
    itemCount.textContent = "0 items";
    totalEl.innerText = "0";
    return;
  }

  emptyMsg.style.display = "none";
  tableContainer.style.display = "block";
  itemCount.textContent = `${items.reduce((a,x)=>a+x.qty,0)} item(s)`;

  itemsContainer.innerHTML = "";
  let total = 0;

  for (const it of items) {
    const inv = Inventory.getById(it.productId);
    const max = inv ? inv.stock : it.qty;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><span class="badge bg-secondary">${it.productId}</span></td>
      <td><strong>${it.name}</strong></td>
      <td><span class="text-success">${formatCurrency(it.price)}</span></td>
      <td style="max-width:140px;">
        <div class="input-group input-group-sm">
          <button class="btn btn-outline-secondary" ${max<=0?'disabled':''} data-action="dec" data-id="${it.productId}">-</button>
          <input type="number" class="form-control text-center" value="${it.qty}" min="1" max="${max}" data-id="${it.productId}">
          <button class="btn btn-outline-secondary" ${it.qty>=max?'disabled':''} data-action="inc" data-id="${it.productId}">+</button>
        </div>
        ${max<=0?'<div class="text-danger small mt-1">Sin stock</div>':''}
      </td>
      <td class="fw-bold">${formatCurrency(it.subtotal)}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger" data-action="remove" data-id="${it.productId}">🗑️ Eliminar</button>
      </td>`;
    itemsContainer.appendChild(row);
    total += it.subtotal;
  }
  totalEl.innerText = total.toLocaleString();

  // Delegated events for qty controls
  itemsContainer.onclick = (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = parseInt(btn.dataset.id, 10);
    const act = btn.dataset.action;
    handleAction(act, id);
  };
  itemsContainer.onchange = (e) => {
    const input = e.target.closest('input[type="number"][data-id]');
    if (!input) return;
    const id = parseInt(input.dataset.id, 10);
    let qty = parseInt(input.value, 10);
    if (!Number.isFinite(qty) || qty < 1) qty = 1;
    const inv = Inventory.getById(id);
    if (inv && qty > inv.stock) qty = inv.stock;
    const items = Cart.get();
    const it = items.find(i => i.productId === id);
    if (it) {
      it.qty = qty;
      Cart.save(items);
      renderCart();
      showToast("Cantidad actualizada", "info");
      updateCartCounter();
    }
  };
}

function handleAction(act, id) {
  const items = Cart.get();
  const it = items.find(x => x.productId === id);
  if (!it) return;
  const inv = Inventory.getById(id);
  const max = inv ? inv.stock : it.qty;
  if (act === "dec") {
    it.qty = Math.max(1, it.qty - 1);
  } else if (act === "inc") {
    it.qty = Math.min(max, it.qty + 1);
  } else if (act === "remove") {
    const idx = items.findIndex(x => x.productId === id);
    if (idx >= 0) items.splice(idx, 1);
  }
  Cart.save(items);
  renderCart();
  updateCartCounter();
}

function emptyCart() {
  Cart.clear();
  renderCart();
  updateCartCounter();
  showToast("Carrito vaciado", "success");
}

function checkout() {
  const items = Cart.get();
  if (items.length === 0) {
    showToast("El carrito está vacío", "warning");
    return;
  }
  const products = Inventory.get();
  const soldOutNames = [];

  // Validación final de stock y rebaja
  for (const it of items) {
    const p = products.find(x => x.id === it.productId);
    if (!p) continue;
    if (it.qty > p.stock) {
      showToast(`Sin stock suficiente para ${p.name}. Disponible: ${p.stock}`, "danger");
      return;
    }
  }
  // Rebajar
  for (const it of items) {
    const p = products.find(x => x.id === it.productId);
    p.stock -= it.qty;
    if (p.stock <= 0) soldOutNames.push(p.name);
  }
  Inventory.save(products);
  Cart.clear();
  renderCart();
  updateCartCounter();
  showToast("¡Compra realizada!", "success");
   if (cart.length === 0) {
        showToast('No hay productos en el carrito', 'warning');
        return;
    }
    if (!customerData) {
        showToast('Por favor ingrese sus datos en la tienda antes de proceder al pago', 'warning');
        return;
    }
    const total = cart.reduce((sum, product) => sum + product.price, 0);
    const itemsText = cart.map(item => `- ${item.name}: $${item.price}`).join('\n');

    const confirmMessage = `
Resumen de compra:
Cliente: ${customerData.name} ${customerData.lastname}

Productos:
${itemsText}

Total: $${total.toLocaleString()}

¿Desea proceder con la compra?
    `;

    if (confirm(confirmMessage)) {
        showToast('¡Compra realizada exitosamente! Gracias por su compra.', 'success');

        setTimeout(() => {
            cart = [];
            localStorage.removeItem("cart");
            renderCart();
        }, 2000);
    }
}

document.addEventListener("DOMContentLoaded", () => {
  displayCustomerInfo();
  renderCart();
  updateCartCounter();
  const emptyBtn = document.getElementById("empty-cart");
  emptyBtn?.addEventListener("click", emptyCart);
  const checkoutBtn = document.getElementById("checkout");
  checkoutBtn?.addEventListener("click", checkout);
  
});