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
    const stockBadge = (p.stock <= 0)
  ? ""
  : (p.stock === 1
      ? `<span class="badge bg-danger text-white ms-1">¡Última unidad!</span>`
      : (p.stock < 4
          ? `<span class="badge bg-warning text-dark ms-1">Quedan ${p.stock}</span>`
          : ""));
return `
  <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
    <div class="card h-100 shadow-sm position-relative">
      <img src="${p.image}" class="card-img-top" alt="${p.name}" loading="lazy">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${p.name}</h5>
        <p class="mb-2 small text-white">${p.description || ""}</p>
        <div class="mb-2">${labelBadge}${catBadge}${stockBadge}</div>
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



/* ============================
   Integración con API externa (DummyJSON)
   Requisitos: usar fetch() para actualizar dinámicamente precio/stock.
   Ahora también **agregamos productos nuevos** provenientes de la API.
   No usa XHR.
============================= */
const ExternalAPI = {
  BASE: "https://dummyjson.com/products",
  CACHE_KEY: "tecnochile_external_cache_v1",
  TTL_MS: 6 * 60 * 60 * 1000, // 6 horas

  _loadCache() {
    try { return JSON.parse(localStorage.getItem(this.CACHE_KEY) || "{}"); }
    catch { return {}; }
  },
  _saveCache(cache) {
    try { localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache)); } catch {}
  },
  _isFresh(ts) {
    return typeof ts === "number" && (Date.now() - ts) < this.TTL_MS;
  },
  async _searchOne(query) {
    const url = `${this.BASE}/search?q=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("API externa no disponible");
    const data = await res.json();
    const item = Array.isArray(data.products) && data.products.length ? data.products[0] : null;
    return item;
  },
  async _fetchCatalog(limit = 50) {
    const res = await fetch(`${this.BASE}?limit=${limit}`);
    if (!res.ok) throw new Error("API externa no disponible");
    const data = await res.json();
    return Array.isArray(data.products) ? data.products : [];
  },
  _norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  },
  async enrichInventory() {
    const inv = await Inventory.load(); // Productos locales actuales
    const cache = this._loadCache();

    // 1) Actualizar precio/stock de los existentes por búsqueda puntual
    const updated = await Promise.all(inv.map(async (p) => {
      let c = cache[p.id];
      const fresh = c && this._isFresh(c.updatedAt);
      if (!fresh) {
        const query = (p.label && String(p.label).trim()) ? p.label : p.name;
        try {
          const item = await this._searchOne(query);
          if (item) {
            c = cache[p.id] = {
              extId: item.id,
              title: item.title,
              brand: item.brand,
              category: item.category,
              price: item.price,
              stock: typeof item.stock === "number" ? item.stock : 0,
              thumbnail: item.thumbnail,
              updatedAt: Date.now()
            };
          }
        } catch { /* noop */ }
      }
      if (c) {
        p.price = Number.isFinite(c.price) ? c.price : p.price;
        if (Number.isFinite(c.stock)) p.stock = c.stock;
        if (!p.image && c.thumbnail) p.image = c.thumbnail;
        if (!p.label && c.brand) p.label = c.brand;
        if (!p.category && c.category) p.category = c.category;
      }
      return p;
    }));

    // 2) Traer un catálogo general y **agregar productos nuevos** no presentes localmente
    let catalog = [];
    try { catalog = await this._fetchCatalog(50); } catch { catalog = []; }

    const byKey = new Map(
      updated.map(p => [this._norm(p.label || p.name || p.id), p])
    );
    let maxId = updated.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0);

    const newOnes = [];
    for (const item of catalog) {
      const normTitle = this._norm(item.title);
      const normCombo = this._norm((item.brand || "") + " " + item.title);
      if (!byKey.has(normTitle) && !byKey.has(normCombo)) {
        maxId += 1;
        const np = new Product({
          id: maxId,
          name: item.title,
          price: item.price,
          image: item.thumbnail,
          stock: typeof item.stock === "number" ? item.stock : 0,
          description: item.description || "Sin descripción",
          category: item.category || "Sin categoría",
          label: item.brand || "",
          tags: [item.brand, item.category].filter(Boolean)
        });
        newOnes.push(np);
        byKey.set(normTitle, np);
      }
    }

    const merged = [...updated, ...newOnes];

    // 3) Guardar en caché (si hubo consultas) y persistir inventario
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
    Inventory.save(merged);
    return merged;
  }
};

// Botón manual para refrescar desde la UI
window.refreshExternalData = async function() {
  const btn = document.getElementById("btnRefreshPrices");
  const status = document.getElementById("apiStatus");
  try {
    if (btn) { btn.disabled = true; btn.innerText = "Actualizando…"; }
    if (status) status.textContent = "Consultando API externa…";
    await ExternalAPI.enrichInventory();
    await initFilters();
    await renderProducts();
    if (status) status.textContent = "Precios/stock actualizados (incluye productos nuevos).";
    showToast("Datos actualizados desde API externa", "success");
  } catch (e) {
    if (status) status.textContent = "No se pudo actualizar: " + e.message;
    showToast("No se pudo actualizar: " + e.message, "danger");
  } finally {
    if (btn) { btn.disabled = false; btn.innerText = "Actualizar precios y stock desde API"; }
    setTimeout(() => { if (status) status.textContent = ""; }, 3500);
  }
};

// Primer refresco silencioso después de la carga
document.addEventListener("DOMContentLoaded", () => {
  ExternalAPI.enrichInventory()
    .then(() => { initFilters(); renderProducts(); })
    .catch(() => { initFilters(); renderProducts(); });
});
