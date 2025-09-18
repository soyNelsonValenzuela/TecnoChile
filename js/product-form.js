(function(){
  function qs(id){ return document.getElementById(id); }
  function getParam(name){
    const u = new URL(location.href);
    return u.searchParams.get(name);
  }
  function nextId(arr){
    return arr.length ? Math.max(...arr.map(p => Number(p.id)||0)) + 1 : 1;
  }
  function parseTags(value){
    if(!value) return [];
    return value.split(",").map(s => s.trim()).filter(Boolean);
  }

  function fillForm(p){
    qs("id").value = p.id;
    qs("name").value = p.name || "";
    qs("description").value = p.description || "";
    qs("price").value = Number(p.price)||0;
    qs("category").value = p.category || "";
    qs("stock").value = Number(p.stock)||0;
    qs("label").value = p.label || "";
    qs("tags").value = Array.isArray(p.tags) ? p.tags.join(", ") : (p.tags || "");
    qs("image").value = p.image || "";
  }

  function readForm(){
    return {
      id: Number(qs("id").value),
      name: qs("name").value.trim(),
      description: qs("description").value.trim(),
      price: Number(qs("price").value)||0,
      category: qs("category").value.trim(),
      stock: Number(qs("stock").value)||0,
      label: qs("label").value.trim(),
      tags: parseTags(qs("tags").value),
      image: qs("image").value.trim()
    };
  }

  document.addEventListener("DOMContentLoaded", () => {
    const data = JSON.parse(localStorage.getItem("inventory") || "[]");
    const idParam = getParam("id");
    const editing = !!idParam;
    const formTitle = document.getElementById("formTitle");

    if(editing){
      const p = data.find(x => String(x.id) === String(idParam));
      if(!p){
        alert("Producto no encontrado."); location.href = "./admin.html"; return;
      }
      formTitle.textContent = `Editar producto`;
      fillForm(p);
    } else {
      const nid = nextId(data);
      qs("id").value = nid;
    }

    document.getElementById("productForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const payload = readForm();
      if(!payload.name || !payload.category || !payload.description || !payload.image){
        alert("Por favor completa todos los campos obligatorios."); return;
      }
      if(editing){
        const idx = data.findIndex(x => x.id === Number(idParam));
        if(idx >= 0){
          payload.id = Number(idParam);
          data[idx] = payload;
        }
      } else {
        data.push(payload);
      }
      localStorage.setItem("inventory", JSON.stringify(data));
      location.href = "./admin.html";
    });
  });
})();