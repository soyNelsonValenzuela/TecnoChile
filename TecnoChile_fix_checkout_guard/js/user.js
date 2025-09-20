(function () {
  const STORAGE_KEY = 'customerData';

  function getStored() {
  const EXPIRATION_MS = 60 * 60 * 1000; 
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) return null;
    if (data.savedAt && (Date.now() - data.savedAt > EXPIRATION_MS)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

 function saveUser(name, lastname) {
  const data = { 
    name: String(name || '').trim(), 
    lastname: String(lastname || '').trim(),
    savedAt: Date.now() 
  };
  if (!data.name || !data.lastname) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    return false;
  }
}

  function renderBadge(targetId = 'customerInfoBadge') {
    const el = document.getElementById(targetId);
    if (!el) return;
    const data = getStored();
    if (data?.name && data?.lastname) {
      el.innerHTML = `<span class="badge">Cliente: <strong>${data.name} ${data.lastname}</strong></span>`;
    } else {
      el.innerHTML = '';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderBadge(); 

    const form = document.getElementById('userForm');
    if (form) {
      const nameInput = document.getElementById('customerName');
      const lastInput = document.getElementById('customerLastname');
      const info = document.getElementById('customerInfo');

      const data = getStored();
      if (data) {
        if (nameInput) nameInput.value = data.name || '';
        if (lastInput) lastInput.value = data.lastname || '';
        if (info) info.innerHTML = `<span class="badge bg-success">Cliente: <strong>${data.name} ${data.lastname}</strong></span>`;
      }

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const ok = saveUser(nameInput?.value, lastInput?.value);
        if (ok) {
          if (info) info.innerHTML = `<span class="badge bg-success">Cliente: <strong>${nameInput.value.trim()} ${lastInput.value.trim()}</strong></span>`;
          renderBadge(); 
        } else {
          if (info) info.innerHTML = `<span class="text-danger">Por favor ingresa tu nombre y apellido.</span>`;
        }
      });
    }
  });

  // Exponer si lo necesitas en otros scripts
  window.UserStore = { getStored, saveUser, renderBadge };
})();

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartIcon = document.getElementById('cartIcon');

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
updateCartCounter();