let cart = JSON.parse(localStorage.getItem("cart")) || [];
let customerData = JSON.parse(localStorage.getItem('customerData')) || null;

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("total-price");
const emptyCartBtn = document.getElementById("empty-cart");
const itemCount = document.getElementById("itemCount");
const emptyCartMessage = document.getElementById("emptyCartMessage");
const cartTableContainer = document.getElementById("cartTableContainer");

let productToDelete = null;

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
                <small>Para realizar una compra, por favor ingrese sus datos en la <a href="tienda.html">tienda</a>.</small>
            </div>
        `;
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

function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartTableContainer.style.display = 'none';
        itemCount.textContent = '0 items';
    } else {
        emptyCartMessage.style.display = 'none';
        cartTableContainer.style.display = 'block';
        itemCount.textContent = `${cart.length} item${cart.length !== 1 ? 's' : ''}`;

        cart.forEach((product, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><span class="badge bg-secondary">${product.id}</span></td>
                <td>
                    <strong>${product.name}</strong>
                </td>
                <td>
                    <span class="text-success">$${product.price.toLocaleString()}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" 
                            onclick="showDeleteConfirmation(${index})"
                            data-bs-toggle="tooltip" 
                            data-bs-placement="top" 
                            title="Eliminar este producto del carrito">
                        🗑️ Eliminar
                    </button>
                </td>
            `;
            cartItems.appendChild(row);
            total += product.price;
        });
    }

    cartTotal.innerText = total.toLocaleString();
    
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    updateCartCounter();
}

function showDeleteConfirmation(index) {
    productToDelete = index;
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    modal.show();
}

function confirmDeleteProduct() {
    if (productToDelete !== null) {
        const removedProduct = cart[productToDelete];
        cart.splice(productToDelete, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        showToast(`${removedProduct.name} eliminado del carrito`, 'success');
        productToDelete = null;
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
        modal.hide();
    }
}

function showEmptyConfirmation() {
    if (cart.length === 0) {
        showToast('El carrito ya está vacío', 'info');
        return;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('confirmEmptyModal'));
    modal.show();
}

function confirmEmptyCart() {
    cart = [];
    localStorage.removeItem("cart");
    renderCart();
    showToast('Carrito vaciado correctamente', 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmEmptyModal'));
    modal.hide();
}

function updateCartCounter() {
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

function checkout() {
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

emptyCartBtn.addEventListener("click", showEmptyConfirmation);

document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDeleteProduct);

document.addEventListener('DOMContentLoaded', function() {
    displayCustomerInfo();
    renderCart();
});
