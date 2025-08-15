(()=>{var r=[{id:1,name:"Reloj",price:300,image:"../assets/img/productos/reloj.webp"},{id:2,name:"Audifonos",price:200,image:"../assets/img/productos/audifono-1.jpeg"},{id:3,name:"Audifonos",price:100,image:"../assets/img/productos/audifono-2.jpeg"},{id:4,name:"Silla",price:400,image:"../assets/img/productos/silla-gamer.jpeg"}],c=[...r],n=JSON.parse(localStorage.getItem("customerData"))||null;function i(){let o=document.getElementById("customerInfo");if(n){o.innerHTML=`
      <span class="badge bg-success">Cliente: <strong>${n.name} ${n.lastname}</strong></span>
    `;let e=document.getElementById("customerName"),a=document.getElementById("customerLastname");e&&(e.value=n.name),a&&(a.value=n.lastname)}}function l(o=c){let e=document.getElementById("productsContainer");e.innerHTML="",o.forEach(t=>{let s=document.createElement("div");s.className="col-md-6 col-lg-4 mb-4",s.innerHTML=`
  <div class="card h-100 shadow-sm bg-dark text-white">
    <img src="${t.image}" class="card-img-top product-img" alt="${t.name}">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">${t.name}</h5>
      <p class="card-text"><strong>Precio: $${t.price}</strong></p>
      <div class="mt-auto">
        <button class="btn btn-success w-100 mb-2"
                onclick="addToCart(${t.id})"
                data-bs-toggle="tooltip" 
                data-bs-placement="top" 
                title="Agregar ${t.name} al carrito">
           Agregar al Carrito
        </button>
        <button class="btn btn-danger w-100"
                onclick="removeFromCart(${t.id})"
                data-bs-toggle="tooltip" 
                data-bs-placement="top" 
                title="Eliminar ${t.name} del carrito">
          Eliminar del Carrito
        </button>
      </div>
    </div>
  </div>
`,e.appendChild(s)}),[].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map(function(t){return new bootstrap.Tooltip(t)})}function d(){let o=JSON.parse(localStorage.getItem("cart"))||[],e=document.querySelector('a[href="carrito.html"]'),a=e.querySelector(".cart-counter");if(a&&a.remove(),o.length>0){let t=document.createElement("span");t.className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-counter",t.style.fontSize="0.7rem",t.textContent=o.length,e.style.position="relative",e.appendChild(t)}}document.addEventListener("DOMContentLoaded",function(){i(),l(),d();let o=new bootstrap.Carousel(document.querySelector("#promoCarousel"),{interval:4e3,wrap:!0})});})();
