// /js/tienda.js — versión OOP con stock y JSON
class Product {
  constructor({ id, name, price, image, stock }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.stock = stock;
  }
  get stockLabel() {
    if (this.stock <= 0) return "Agotado";
    if (this.stock === 1) return "¡Último!";
    if (this.stock < 4) return `Quedan ${this.stock}`;
    return "";
  }
}

class Inventory {
  static STORAGE_KEY = "inventory";
  static async load() {
    // Si ya está en localStorage, usarlo; si no, leer JSON y persistirlo
    const cached = localStorage.getItem(Inventory.STORAGE_KEY);
    if (cached) {
      const arr = JSON.parse(cached);
      return arr.map(p => new Product(p));
    }
    const res = await fetch("../assets/data/products.json");
    const data = await res.json();
    localStorage.setItem(Inventory.STORAGE_KEY, JSON.stringify(data));
    return data.map(p => new Product(p));
  }
  static save(products) {
    localStorage.setItem(Inventory.STORAGE_KEY, JSON.stringify(products));
  }
  static updateStock(productId, newStock) {
    const products = JSON.parse(localStorage.getItem(Inventory.STORAGE_KEY) || "[]");
    const idx = products.findIndex(p => p.id === productId);
    if (idx >= 0) {
      products[idx].stock = newStock;
      localStorage.setItem(Inventory.STORAGE_KEY, JSON.stringify(products));
    }
  }
  static getById(productId) {
    const products = JSON.parse(localStorage.getItem(Inventory.STORAGE_KEY) || "[]");
    const raw = products.find(p => p.id === productId);
    return raw ? new Product(raw) : null;
  }
  static listSoldOut() {
    const products = JSON.parse(localStorage.getItem(Inventory.STORAGE_KEY) || "[]");
    return products.filter(p => p.stock <= 0).map(p => new Product(p));
  }
}

class CartItem {
  constructor(productId, name, price, qty) {
    this.productId = productId;
    this.name = name;
    this.price = price;
    this.qty = qty;
  }
  get subtotal() {
    return this.qty * this.price;
  }
}

class Cart {
  static STORAGE_KEY = "cart";
  static get() {
    const raw = JSON.parse(localStorage.getItem(Cart.STORAGE_KEY) || "[]");
    return raw.map(i => new CartItem(i.productId, i.name, i.price, i.qty));
  }
  static save(items) {
    localStorage.setItem(Cart.STORAGE_KEY, JSON.stringify(items));
  }
  static add(product, qty) {
    const items = Cart.get();
    const existing = items.find(i => i.productId === product.id);
    const newQty = (existing?.qty || 0) + qty;
    const stock = Inventory.getById(product.id)?.stock ?? 0;
    if (newQty > stock) {
      throw new Error(`No hay stock suficiente. Disponible: ${stock}`);
    }
    if (existing) {
      existing.qty = newQty;
    } else {
      items.push(new CartItem(product.id, product.name, product.price, qty));
    }
    Cart.save(items);
  }
  static setQty(productId, qty) {
    const items = Cart.get();
    const it = items.find(i => i.productId === productId);
    if (!it) return;
    const stock = Inventory.getById(productId)?.stock ?? 0;
    if (qty > stock) throw new Error(`No hay stock suficiente. Disponible: ${stock}`);
    it.qty = qty;
    if (it.qty <= 0) {
      Cart.remove(productId);
    } else {
      Cart.save(items);
    }
  }
  static remove(productId) {
    const items = Cart.get().filter(i => i.productId !== productId);
    Cart.save(items);
  }
  static clear() {
    localStorage.removeItem(Cart.STORAGE_KEY);
  }
  static total() {
    return Cart.get().reduce((acc, i) => acc + i.subtotal, 0);
  }
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

function productCard(p) {
  const disabled = p.stock <= 0 ? "disabled" : "";
  const stockBadge = p.stockLabel ? `<span class="badge bg-${p.stock<=0?'danger':p.stock===1?'warning':'info'}">${p.stockLabel}</span>` : "";
  return `
  <div class="col-md-3 mb-4">
    <div class="card h-100 shadow-sm">
      <img src="${p.image}" class="card-img-top" alt="${p.name}">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title d-flex justify-content-between align-items-center">
          <span>${p.name}</span>
          ${stockBadge}
        </h5>
        <p class="card-text fw-bold text-success mb-2">$${p.price.toLocaleString()}</p>
        <div class="input-group mb-2">
          <span class="input-group-text">Cant.</span>
          <input type="number" class="form-control" min="1" max="${Math.max(p.stock,0)}" value="1" id="qty-${p.id}" ${disabled}>
        </div>
        <div class="mt-auto d-grid gap-2">
          <button class="btn btn-primary" ${disabled} onclick="handleAdd(${p.id})">Agregar al carrito</button>
        </div>
      </div>
      ${p.stock<=0 ? '<div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 text-white fw-bold">AGOTADO</div>': ''}
    </div>
  </div>`;
}

async function renderProducts(filter="") {
  const container = document.getElementById("product-list");
  const inv = await Inventory.load();
  let list = inv;
  if (filter) {
    const q = filter.toLowerCase();
    list = inv.filter(p => p.name.toLowerCase().includes(q));
  }
  container.innerHTML = list.map(productCard).join("");
  renderSoldOutAlert();
}

function renderSoldOutAlert() {
  const out = Inventory.listSoldOut();
  const alert = document.getElementById("soldOutAlert");
  if (!alert) return;
  if (out.length === 0) {
    alert.innerHTML = "";
    alert.style.display = "none";
    return;
  }
  alert.style.display = "block";
  alert.className = "alert alert-warning";
  alert.innerHTML = `<strong>Productos sin stock:</strong> ${out.map(p=>p.name).join(", ")}`;
}

window.handleAdd = function(productId) {
  const p = Inventory.getById(productId);
  if (!p) return;
  const qtyInput = document.getElementById(`qty-${productId}`);
  const qty = Math.max(1, parseInt(qtyInput?.value || "1", 10));
  try {
    Cart.add(p, qty);
    showToast(`${p.name} x${qty} agregado(s) al carrito`, "success");
    updateCartCounter();
  } catch (e) {
    showToast(e.message, "danger");
  }
};

window.filterProducts = function() {
  const v = document.getElementById("productFilter")?.value || "";
  renderProducts(v);
};

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
});