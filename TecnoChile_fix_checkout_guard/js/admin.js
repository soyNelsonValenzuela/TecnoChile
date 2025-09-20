(function(){
  function renderRow(p){
    return `
      <tr>
        <td><span class="badge bg-secondary">${p.id}</span></td>
        <td>${p.name}</td>
        <td class="small text-muted">${p.description || ""}</td>
        <td class="fw-bold text-success">$${(Number(p.price)||0).toLocaleString()}</td>
        <td>${p.category || ""}</td>
        <td>${p.stock ?? 0}</td>
        <td>${p.label || ""}</td>
        <td class="text-nowrap">
          <a class="btn btn-sm btn-outline-primary me-1" href="./product-form.html?id=${p.id}" title="Editar"><i class="bi bi-pencil-square"></i></a>
          <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${p.id}" title="Eliminar"><i class="bi bi-trash3"></i></button>
        </td>
      </tr>`;
  }

  function renderTable(){
    const tbody = document.getElementById("adminTableBody");
    const data = JSON.parse(localStorage.getItem("inventory") || "[]");
    tbody.innerHTML = data.map(renderRow).join("");
  }

  function onClick(e){
    const btn = e.target.closest("[data-action='delete']");
    if(!btn) return;
    const id = Number(btn.dataset.id);
    const data = JSON.parse(localStorage.getItem("inventory") || "[]");
    const p = data.find(x => x.id === id);
    if(!p) return;
    if(confirm(`¿Eliminar el producto "${p.name}" (ID ${p.id})? Esta acción no se puede deshacer.`)){
      const next = data.filter(x => x.id !== id);
      localStorage.setItem("inventory", JSON.stringify(next));
      renderTable();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    if(!localStorage.getItem("inventory")){
      fetch("../assets/data/products.json")
        .then(r => r.json())
        .then(arr => localStorage.setItem("inventory", JSON.stringify(arr)))
        .finally(renderTable);
    } else {
      renderTable();
    }
    document.body.addEventListener("click", onClick);
  });
})();