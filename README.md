# 🛒 Tecno Chile – Tienda Online

Este proyecto corresponde a la actividad **"Orientación a Objetos en JavaScript"** dentro del programa de desarrollo web.  
El objetivo fue construir una tienda online con carrito de compras dinámico, utilizando **JavaScript orientado a objetos**, Bootstrap y estilos propios.

## 🚀 Características principales

- **Listado de productos dinámico** cargado desde un archivo `JSON` (`assets/data/products.json`).
- **Carrito de compras completo**:
  - Agregar productos con cantidad seleccionada.
  - Modificar cantidades directamente desde el carrito (incrementar, decrementar o editar).
  - Eliminar ítems o vaciar el carrito completo.
- **Validación de stock**:
  - No permite agregar más unidades de las disponibles.
  - Muestra mensajes especiales:
    - `Agotado` → producto no se puede agregar.
    - `¡Último!` → cuando queda 1 en inventario.
    - `Quedan X` → cuando quedan menos de 4 unidades.
- **Checkout**:
  - Rebaja automáticamente el stock tras la compra.
  - Si algún producto llega a stock 0, se alerta mediante un **correo automático (mailto)** al responsable.
- **UI con Bootstrap 5** y estilos personalizados (`css/style.css`):
  - Cards con hover, gradientes y sombras.
  - Navbar sticky y footer pegado al fondo.
  - Sección especial "Nuestra Propuesta" con grid responsive.

## 📂 Estructura del proyecto

```bash
tienda-online/
├── index.html                # Página principal
├── pages/                    # Páginas internas
│   ├── productos.html         # Listado de productos
│   ├── carrito.html           # Carrito de compras
│   ├── user.html              # Datos de cliente
│   ├── sobre-nosotros.html    # Información de la empresa
│   └── contacto.html          # Formulario de contacto
├── js/                       # Lógica en JavaScript
│   ├── tienda.js              # Renderizado de productos y carrito (POO)
│   ├── carrito.js             # Gestión del carrito y checkout
│   └── user.js                # Manejo de datos de cliente
├── css/style.css              # Estilos principales
├── assets/
│   ├── img/                   # Logos e imágenes
│   └── data/products.json     # Catálogo de productos
└── README.md
```

## ⚙️ Requisitos previos

- Navegador moderno (Chrome, Firefox, Edge).
- [Node.js](https://nodejs.org/) (opcional, para montar un servidor local).
- Conexión a internet para Bootstrap vía CDN.