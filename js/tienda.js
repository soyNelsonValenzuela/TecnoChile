const products = [
  { id: 1, name: "Reloj", price: 300, image: "../assets/img/productos/reloj.webp" },
  { id: 2, name: "Audifonos", price: 200, image: "../assets/img/productos/audifono-1.jpeg" },
  { id: 3, name: "Audifonos", price: 100, image: "../assets/img/productos/audifono-2.jpeg" },
  { id: 4, name: "Silla", price: 400, image: "../assets/img/productos/silla-gamer.jpeg" }
];

let allProducts = [...products];
let customerData = JSON.parse(localStorage.getItem('customerData')) || null;

function displayCustomerInfo() {
  const customerInfoDiv = document.getElementById('customerInfo');
  if (customerData) {
  customerInfoDiv.innerHTML = `
      <span class="badge bg-success">Cliente: <strong>${customerData.name} ${customerData.lastname}</strong></span>
    `;
  const nameInput = document.getElementById('customerName');
  const lastInput = document.getElementById('customerLastname');
  if (nameInput) nameInput.value = customerData.name;
  if (lastInput) lastInput.value = customerData.lastname;
  }
}

function saveCustomerInfo() {
  const name = document.getElementById('customerName').value.trim();
  const lastname = document.getElementById('customerLastname').value.trim();

  if (name && lastname) {
    customerData = { name, lastname };
    localStorage.setItem('customerData', JSON.stringify(customerData));
    displayCustomerInfo();

    showToast('Información guardada correctamente', 'success');
  } else {
    showToast('Por favor complete todos los campos', 'warning');
  }
}

function showToast(message, type = 'info') {
  const toastContainer = document.createElement('div');
  toastContainer.className = 'position-fixed top-0 end-0 p-3';
  toastContainer.style.zIndex = '1050';

  const toastId = 'toast-' + Date.now();
  toastContainer.innerHTML = `
        <div id="${toastId}" class="toast" role="alert">
            <div class="toast-header">
                <strong class="me-auto text-${type}">Notificación</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;

  document.body.appendChild(toastContainer);
  const toast = new bootstrap.Toast(document.getElementById(toastId));
  toast.show();

  setTimeout(() => {
    document.body.removeChild(toastContainer);
  }, 5000);
}

function renderProducts(productsToRender = allProducts) {
  const container = document.getElementById('productsContainer');
  container.innerHTML = '';

  productsToRender.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'col-md-6 col-lg-4 mb-4';

    productCard.innerHTML = `
  <div class="card h-100 shadow-sm bg-dark text-white">
    <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">${product.name}</h5>
      <p class="card-text"><strong>Precio: $${product.price}</strong></p>
      <div class="mt-auto">
        <button class="btn btn-success w-100 mb-2"
                onclick="addToCart(${product.id})"
                data-bs-toggle="tooltip" 
                data-bs-placement="top" 
                title="Agregar ${product.name} al carrito">
           Agregar al Carrito
        </button>
        <button class="btn btn-danger w-100"
                onclick="removeFromCart(${product.id})"
                data-bs-toggle="tooltip" 
                data-bs-placement="top" 
                title="Eliminar ${product.name} del carrito">
          Eliminar del Carrito
        </button>
      </div>
    </div>
  </div>
`;

    container.appendChild(productCard);
  });

  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

function filterProducts() {
  const filterValue = document.getElementById('productFilter').value.toLowerCase();

  if (filterValue === '') {
    allProducts = [...products];
  } else {
    allProducts = products.filter(product =>
      product.name.toLowerCase().includes(filterValue) ||
      product.id.toString().includes(filterValue) ||
      product.price.toString().includes(filterValue)
    );
  }

  renderProducts();
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  if (!customerData) {
    showToast('Por favor ingrese sus datos antes de agregar productos al carrito', 'warning');
    document.getElementById('customerName').focus();
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  cart.push({
    id: product.id,
    name: product.name,
    price: product.price
  });

  localStorage.setItem('cart', JSON.stringify(cart));

  showToast(`${product.name} agregado al carrito`, 'success');
  updateCartCounter();
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const index = cart.findIndex(item => item.id === productId);
  if (index !== -1) {
    const removed = cart.splice(index, 1)[0];
    localStorage.setItem('cart', JSON.stringify(cart));
    showToast(`${removed.name} eliminado del carrito`, 'info');
    updateCartCounter();
  } else {
    showToast('Este producto no está en el carrito', 'warning');
  }
}

function updateCartCounter() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartIcon = document.querySelector('a[href="carrito.html"]');

  const existingCounter = cartIcon.querySelector('.cart-counter');
  if (existingCounter) {
    existingCounter.remove();
  }

  if (cart.length > 0) {
    const counter = document.createElement('span');
    counter.className = 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-counter';
    counter.style.fontSize = '0.7rem';
    counter.textContent = cart.length;
    cartIcon.style.position = 'relative';
    cartIcon.appendChild(counter);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  displayCustomerInfo();
  renderProducts();
  updateCartCounter();

  const carousel = new bootstrap.Carousel(document.querySelector('#promoCarousel'), {
    interval: 4000,
    wrap: true
  });
});