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

## 🧩 Novedades ABPRO3 – JavaScript Asíncrono

> Extensión del proyecto para cumplir los requisitos de **Javascript Asíncrono** (ABPRO3).

### ✅ Checklist de requisitos cumplidos
- **Lectura asíncrona de productos con `fetch()`** desde `assets/data/products.json`. (Implementado en `Inventory.load()` en `js/tienda.js`).  
- **Actualización de stock tras compra** simulando servidor con promesas/`setTimeout` en `js/carrito.js` (durante `checkout()` se descuenta stock “en servidor” y luego se persiste).  
- **Error por stock insuficiente después de verificación asíncrona** al intentar agregar al carrito; la verificación ocurre antes de confirmar la acción.  


### 🏷️ Etiquetas de stock en tarjetas de producto
- Si `stock === 1` → badge **rojo**: “¡Última unidad!”.  
- Si `stock < 4` y `> 1` → badge **amarillo**: “Quedan X”.  
- Caso contrario → no se muestra badge.  
> Lógica en `js/tienda.js` con la variable `stockBadge` incluida junto a los demás badges en la card.

---


---

## Consumo de API externa con `fetch()`

**Estado:** Implementado.  
Para cumplir con la actividad (API externa y actualización dinámica) 

- Se integró la API pública **DummyJSON** (`/products` y `/products/search?q=`) exclusivamente usando **`fetch()`** (sin XHR).
- Al cargar la página **Productos**, el módulo `ExternalAPI` consulta la API y **enriquece el inventario** con `precio` y `stock` en tiempo real.  
- Se implementó **caché local** en `localStorage` (`tecnochile_external_cache_v1`) con TTL de 6 horas para evitar llamadas innecesarias y mejorar rendimiento.
- Se agregó un botón **“Actualizar precios y stock desde API”** que fuerza la actualización manual (y muestra estado de la consulta).

### Endpoints usados
- `https://dummyjson.com/products/search?q=<query>&limit=1` – Se busca por `label` o `name` del producto y se toma la mejor coincidencia.
- Respuesta esperada: `{ products: [{ id, title, brand, category, price, stock, thumbnail, ... }] }`

### Manejo de errores
- Si la API externa falla, la tienda **sigue funcionando** con los datos locales de `assets/data/products.json` y los ya guardados en `localStorage`.
- Mensajes de estado y *toasts* informan si la actualización fue exitosa o no.

### Comparación XHR vs Fetch (resumen conceptual)
- **Fetch** (usado aquí): interfaz basada en *Promises*, soporte nativo para `async/await`, **más legible y moderna**.
- **XHR**: API heredada basada en *callbacks*, más verbosa y con manejo de estados manual.  
> Por requerimiento explícito del proyecto, **no se implementó XHR** en el código, solo se explica la diferencia.

### Cómo probar
1. Abrir `pages/productos.html` en un servidor estático (por ejemplo, `npx http-server` o la extensión *Live Server*).
2. Verás los productos. En segundos, se actualizarán **precio y stock** desde la API.  
3. Usa el botón **“Actualizar precios y stock desde API”** para forzar una nueva consulta.
4. Observa el filtro de **Precio máximo**: se recalcula automáticamente tras la actualización.

> Si estás *offline* o la API no responde, se mostrarán los datos locales y un mensaje de error no bloqueante.



### Productos nuevos desde la API
Además de enriquecer los productos locales, el módulo consulta un **catálogo general** y **agrega productos nuevos** que no existían en `products.json`.  
- El emparejamiento evita duplicados por nombre/label normalizados.  
- Los nuevos ítems reciben un `id` incremental, y se muestran de inmediato con datos externos.

