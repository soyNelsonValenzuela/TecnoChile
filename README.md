# Proyecto – M5AE2 ABPRO2  
**Tecno Chile – Carrito de Compras con ES6 y Administrador de Inventario**

Este proyecto corresponde a la actividad **ABPRO2 del Módulo 5**, en el contexto de la empresa ficticia *Tecno Chile*. Su objetivo es implementar un **carrito de compras migrado a ES6**, incorporar **filtros de productos avanzados** y un **Administrador de Inventario** que permita crear, editar y eliminar productos de manera dinámica.

## 🎯 Aprendizaje Esperado
> Utilizar las nuevas funcionalidades de la especificación **ES6+** para implementar un algoritmo de carrito de compras y un administrador de inventario con persistencia en `localStorage`.

---

## 🚀 Requerimientos Implementados
1. **Migración ES5 → ES6**  
   - Uso de clases, `const/let`, arrow functions y `async/await`.

2. **Extensión del modelo de producto**  
   - Cada producto incluye: `id`, `name`, `price`, `image`, `stock`, `description`, `category`, `label`, `tags`.

3. **Filtros de productos (cliente)**  
   - **Categoría** (select dinámico).  
   - **Precio máximo** (input range con valor en vivo).  
   - **Texto libre** (busca en nombre, descripción, categoría, etiqueta y tags).

4. **Administrador de Inventario (ABM)**  
   - **Listado**: muestra productos con nombre, descripción, precio, categoría, cantidad y etiqueta.  
   - **Nuevo producto**: formulario para añadir productos al inventario.  
   - **Editar producto**: formulario con datos precargados, sin modificar el ID.  
   - **Eliminar producto**: acción con confirmación.  

5. **Persistencia entre páginas**  
   - Implementada con `localStorage`.  
   - `Inventory.load()` hace merge con `products.json` para rellenar campos faltantes.

6. **Diseño**  
   - Basado en **Bootstrap 5** + estilos propios (`css/style.css`).  
   - Uso de **Bootstrap Icons** para acciones en el admin.

---

## 📂 Estructura del Proyecto
```
M5AE2-ABP2-ABPRO2/
│
├── assets/
│   ├── data/products.json       # Datos base de productos
│   └── img/                     # Imágenes y logo
│
├── css/
│   └── style.css                # Estilos personalizados
│
├── js/
│   ├── tienda.js                # Lógica principal de productos y carrito
│   ├── admin.js                 # Lógica de listado y borrado de productos
│   └── product-form.js          # Lógica de creación/edición de productos
│
├── pages/
│   ├── productos.html           # Tienda con filtros y cards
│   ├── admin.html               # Administrador de inventario
│   └── product-form.html        # Formulario de crear/editar productos
│
└── index.html                   # Página principal (landing)
```

---

## 🛠️ Instalación y Uso
1. Clonar o descargar este repositorio.  
2. Abrir el proyecto en un servidor local (por ejemplo con la extensión **Live Server** de VS Code).  
3. Navegar a:
   - `pages/productos.html` → Ver productos y probar filtros/carrito.  
   - `pages/admin.html` → Administrar inventario.  
   - `pages/product-form.html` → Crear o editar un producto.  

⚠️ **Importante**: El inventario se guarda en `localStorage`. Si cambias el `products.json` y quieres resembrar datos, borra la clave `inventory` en tu navegador o implementa el botón de “Reset inventario” en el admin.

---

## 📚 Tecnologías
- **HTML5 / CSS3**
- **JavaScript ES6+**
- **Bootstrap 5** + **Bootstrap Icons**
- **localStorage**

---

## 👨‍💻 Autor
Nelson Valenzuela – *Desarrollador Full Stack en formación*  
Repositorio GitHub: [@soyNelsonValenzuela](https://github.com/soyNelsonValenzuela)
