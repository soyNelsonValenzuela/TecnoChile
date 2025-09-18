class Product {
  constructor({ id, name, price, image, stock, description = "Sin descripción", category = "Sin categoría", label = "", tags = [] }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.stock = stock;
    this.description = description;
    this.category = category;
    this.label = label;
    this.tags = Array.isArray(tags) ? tags : (typeof tags === 'string' && tags ? tags.split(',').map(s=>s.trim()) : []);
  }
  get stockLabel() {
    if (this.stock <= 0) return "Agotado";
    if (this.stock === 1) return "¡Último!";
    if (this.stock < 4) return `Quedan ${this.stock}`;
    return "";
  }
}

class Inventory {
static get _arr() {
    return JSON.parse(localStorage.getItem(Inventory.STORAGE_KEY) || "[]");
  }
  static getMinMaxPrice() {
    const arr = Inventory._arr;
    const prices = arr.map(p => Number(p.price) || 0);
    if (prices.length === 0) return { min: 0, max: 0 };
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }
  static getCategories() {
    const arr = Inventory._arr;
    const set = new Set(arr.map(p => p.category || "Sin categoría"));
    return Array.from(set);
  }
  static STORAGE_KEY = "inventory";
  static async load() {
  const fromLS = JSON.parse(localStorage.getItem(Inventory.STORAGE_KEY) || "null");
  const assetsBase = location.pathname.includes("/pages/") ? "../assets" : "./assets";
  let defaults = [];
  try {
    defaults = await fetch(`${assetsBase}/data/products.json`)
      .then(r => r.ok ? r.json() : [])
      .catch(() => []);
    if (!Array.isArray(defaults)) defaults = [];
  } catch { defaults = []; }

  if (!Array.isArray(fromLS) || fromLS.length === 0) {
    if (defaults.length > 0) {
      localStorage.setItem(Inventory.STORAGE_KEY, JSON.stringify(defaults));
      return defaults.map(obj => new Product(obj));
    }
    localStorage.setItem(Inventory.STORAGE_KEY, "[]");
    return [];
  }

  const defById = Object.fromEntries(defaults.map(d => [Number(d.id), d]));
  const merged = fromLS.map(p => {
    const d = defById[Number(p.id)] || {};
    return new Product({
      id: p.id,
      name: p.name ?? d.name,
      price: p.price ?? d.price,
      image: p.image ?? d.image,
      stock: p.stock ?? d.stock,
      description: (p.description && String(p.description).trim()) ? p.description : (d.description ?? "Sin descripción"),
      category: (p.category && String(p.category).trim()) ? p.category : (d.category ?? "Sin categoría"),
      label: (p.label && String(p.label).trim()) ? p.label : (d.label ?? ""),
      tags: (p.tags && p.tags.length) ? p.tags : (d.tags ?? [])
    });
  });

  localStorage.setItem(Inventory.STORAGE_KEY, JSON.stringify(merged));

  return merged;
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
  const labelBadge = p.label ? `<span class="badge bg-info text-dark me-1">${p.label}</span>` : "";
  const catBadge = p.category ? `<span class="badge bg-secondary">${p.category}</span>` : "";
  return `
  <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
    <div class="card h-100 shadow-sm position-relative">
      <img src="${p.image}" class="card-img-top" alt="${p.name}" loading="lazy">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${p.name}</h5>
        <p class="mb-2 small text-white">${p.description || ""}</p>
        <div class="mb-2">${labelBadge}${catBadge}</div>
        <p class="card-text fw-bold text-success mb-2">$${(Number(p.price)||0).toLocaleString()}</p>
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

async function renderProducts() {
  const container = document.getElementById("product-list");
  const inv = await Inventory.load();
  const text = (document.getElementById("textFilter")?.value || document.getElementById("productFilter")?.value || "").toLowerCase().trim();
  const category = (document.getElementById("categoryFilter")?.value || "").toLowerCase();
  const priceMax = Number(document.getElementById("priceFilter")?.value || 0);
  let list = inv.filter(p => {
    const withinCategory = !category || (p.category || "").toLowerCase() === category;
    const withinPrice = !priceMax || Number(p.price) <= priceMax;
    if (!text) return withinCategory && withinPrice;
    const haystack = [
      p.name, p.description, p.category, p.label,
      ...(Array.isArray(p.tags) ? p.tags : [])
    ].filter(Boolean).join(" ").toLowerCase();
    const matchesText = haystack.includes(text);
    return withinCategory && withinPrice && matchesText;
  });
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

document.addEventListener("DOMContentLoaded", () => { initFilters(); renderProducts(); });

async function initFilters() {
  const inv = await Inventory.load();
  const sel = document.getElementById("categoryFilter");
  if (sel) {
    const cats = Array.from(new Set(inv.map(p => p.category || "Sin categoría")));
    sel.innerHTML = `<option value="">Todas</option>` + cats.map(c => `<option value="${c}">${c}</option>`).join("");
  }
  const range = document.getElementById("priceFilter");
  const priceOut = document.getElementById("priceFilterValue");
 if (range) {
  const min = Math.min(...inv.map(p => Number(p.price) || 0));
  const max = Math.max(...inv.map(p => Number(p.price) || 0));
  range.min = String(min);
  range.max = String(max);
  range.value = String(max); 
  if (priceOut) priceOut.textContent = `$${Number(range.value).toLocaleString()}`;
  range.addEventListener("input", () => {
    if (priceOut) priceOut.textContent = `$${Number(range.value).toLocaleString()}`;
    renderProducts();
  });
}
  const tf = document.getElementById("textFilter") || document.getElementById("productFilter");
  if (tf) tf.addEventListener("input", () => renderProducts());
  if (sel) sel.addEventListener("change", () => renderProducts());
}
