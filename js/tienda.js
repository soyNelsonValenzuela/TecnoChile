const productos = [
  { id: 1, nombre: "Reloj", precio: 300, imagen: "../img/productos/reloj.webp" },
  { id: 2, nombre: "Audífonos", precio: 200, imagen: "../img/productos/audifono-1.jpeg" },
  { id: 3, nombre: "Audífonos", precio: 100, imagen: "../img/productos/audifono-2.jpeg" },
  { id: 4, nombre: "Silla", precio: 400, imagen: "../img/productos/silla-gamer.jpeg" }
];

let carrito = JSON.parse(localStorage.getItem("cart")) || [];

function renderProductos(container, filtro = "") {
  container.innerHTML = "";

  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  filtrados.forEach(p => {
    const card = document.createElement("div");
    card.className = "col-md-3 mb-4";
    card.innerHTML = `
  <div class="card h-100">
    <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
    <div class="card-body d-flex flex-column justify-content-between">
      <h5 class="card-title">${p.nombre}</h5>
      <p class="card-text">Precio: $${p.precio}</p>
      <button class="btn btn-success btn-sm mb-1" data-id="${p.id}" data-action="agregar">Agregar al carrito</button>
      <button class="btn btn-danger btn-sm" data-id="${p.id}" data-action="eliminar">Eliminar</button>
    </div>
  </div>
`;
    container.appendChild(card);
  });

  // Delegar eventos
  container.querySelectorAll("button").forEach(btn => {
    const id = parseInt(btn.dataset.id);
    const action = btn.dataset.action;

    btn.addEventListener("click", () => {
      if (action === "agregar") agregarAlCarrito(id);
      else if (action === "eliminar") eliminarDelCarrito(id);
    });
  });
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (producto) {
    carrito.push({ name: producto.nombre, price: producto.precio });
    localStorage.setItem("cart", JSON.stringify(carrito));
    mostrarAlertaBootstrap(`"${producto.nombre}" fue agregado al carrito`, "success");
  }
}

function eliminarDelCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const index = carrito.findIndex(item => item.name === producto.nombre && item.price === producto.precio);
  if (index !== -1) {
    carrito.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(carrito));
    mostrarAlertaBootstrap(`"${producto.nombre}" fue eliminado del carrito`, "info");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("productosContainer");
  const filtroInput = document.getElementById("filtroInput");

  renderProductos(container);

  filtroInput.addEventListener("input", (e) => {
    renderProductos(container, e.target.value);
  });
});

function mostrarAlertaBootstrap(mensaje, tipo = "success") {
  const container = document.getElementById("alert-container");
  const alerta = document.createElement("div");

  alerta.className = `alert alert-${tipo} alert-dismissible fade show mt-2`;
  alerta.setAttribute("role", "alert");
  alerta.innerHTML = `
    ${mensaje}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
  `;

  container.appendChild(alerta);

  // Quitar automáticamente después de 3 segundos
  setTimeout(() => {
    alerta.classList.remove("show");
    alerta.classList.add("hide");
    setTimeout(() => alerta.remove(), 300);
  }, 3000);
}