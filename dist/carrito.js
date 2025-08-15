(()=>{var o=JSON.parse(localStorage.getItem("cart"))||[],l=JSON.parse(localStorage.getItem("customerData"))||null,c=document.getElementById("cart-items"),g=document.getElementById("total-price"),y=document.getElementById("empty-cart"),i=document.getElementById("itemCount"),d=document.getElementById("emptyCartMessage"),m=document.getElementById("cartTableContainer"),s=null;function f(){let e=document.getElementById("customerDisplay");l?e.innerHTML=`
            <div class="alert alert-info">
                <strong>Cliente:</strong> ${l.name} ${l.lastname}
            </div>
        `:e.innerHTML=`
            <div class="alert alert-warning">
                <strong>\u26A0\uFE0F No hay informaci\xF3n de cliente</strong><br>
                <small>Para realizar una compra, por favor ingrese sus datos en la <a href="tienda.html">tienda</a>.</small>
            </div>
        `}function u(e,n="info"){let t=document.createElement("div");t.className="position-fixed top-0 end-0 p-3",t.style.zIndex="1050";let a="toast-"+Date.now();t.innerHTML=`
        <div id="${a}" class="toast" role="alert">
            <div class="toast-header">
                <strong class="me-auto text-${n}">Notificaci\xF3n</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${e}
            </div>
        </div>
    `,document.body.appendChild(t),new bootstrap.Toast(document.getElementById(a)).show(),setTimeout(()=>{document.body.removeChild(t)},5e3)}function p(){c.innerHTML="";let e=0;o.length===0?(d.style.display="block",m.style.display="none",i.textContent="0 items"):(d.style.display="none",m.style.display="block",i.textContent=`${o.length} item${o.length!==1?"s":""}`,o.forEach((t,a)=>{let r=document.createElement("tr");r.innerHTML=`
                <td><span class="badge bg-secondary">${t.id}</span></td>
                <td>
                    <strong>${t.name}</strong>
                </td>
                <td>
                    <span class="text-success">$${t.price.toLocaleString()}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" 
                            onclick="showDeleteConfirmation(${a})"
                            data-bs-toggle="tooltip" 
                            data-bs-placement="top" 
                            title="Eliminar este producto del carrito">
                        \u{1F5D1}\uFE0F Eliminar
                    </button>
                </td>
            `,c.appendChild(r),e+=t.price})),g.innerText=e.toLocaleString(),[].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map(function(t){return new bootstrap.Tooltip(t)}),C()}function b(){if(s!==null){let e=o[s];o.splice(s,1),localStorage.setItem("cart",JSON.stringify(o)),p(),u(`${e.name} eliminado del carrito`,"success"),s=null,bootstrap.Modal.getInstance(document.getElementById("confirmDeleteModal")).hide()}}function h(){if(o.length===0){u("El carrito ya est\xE1 vac\xEDo","info");return}new bootstrap.Modal(document.getElementById("confirmEmptyModal")).show()}function C(){let e=document.querySelector('a[href="carrito.html"]'),n=e.querySelector(".cart-counter");if(n&&n.remove(),o.length>0){let t=document.createElement("span");t.className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-counter",t.style.fontSize="0.7rem",t.textContent=o.length,e.style.position="relative",e.appendChild(t)}}y.addEventListener("click",h);document.getElementById("confirmDeleteBtn").addEventListener("click",b);document.addEventListener("DOMContentLoaded",function(){f(),p()});})();
