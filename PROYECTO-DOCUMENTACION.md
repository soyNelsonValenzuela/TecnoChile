# Tienda Online Tecno Chile - Proyecto JavaScript

## Descripción del Proyecto

Este proyecto implementa una tienda online completamente funcional llamada "Tecno Chile" con todas las características requeridas para el proyecto de Fundamentos de Programación en JavaScript.

## Requerimientos Implementados

### ✅ 1. Prototipo Web Responsivo
- Sitio web completamente responsivo usando CSS y Bootstrap 5.3.0
- Diseño adaptable a diferentes tamaños de pantalla
- Layout moderno y funcional

### ✅ 2. Implementación de Bootstrap
- **Bootstrap 5.3.0** integrado en todas las páginas
- **Carousel**: Implementado en la página de tienda con 3 slides promocionales
- **Tooltips**: Agregados a botones de productos y carrito
- **Modals**: Para confirmaciones de eliminación y vaciado del carrito
- **Cards**: Para mostrar productos y información del cliente
- **Toast notifications**: Para feedback del usuario
- **Responsive Grid System**: Para layout de productos

### ✅ 3. Componente Navbar
- Navegación funcional entre todas las secciones
- Enlaces a: Shop, Sobre nosotros, Blog, Contacto
- Iconos de búsqueda, usuario y carrito
- Contador dinámico en el icono del carrito

### ✅ 4. Footer con Iconos de Redes Sociales
- Footer implementado con iconos de Instagram, Facebook y Twitter
- Enlaces de políticas y derechos de autor
- Diseño consistente en todas las páginas

### ✅ 5. Solicitud de Datos del Cliente
- Formulario para capturar nombre y apellido del usuario
- Datos almacenados en localStorage
- Información mostrada en sección cliente
- Validación antes de permitir compras

### ✅ 6. Página de Ventas con Cards de Bootstrap
- Cards de Bootstrap para mostrar productos
- Funcionalidad "Agregar al carrito"
- Lista de productos con nombre y precio
- Diseño atractivo y funcional

### ✅ 7. Estructura de Datos con Arreglos
```javascript
const products = [
    { id: 1, name: "Reloj", price: 300, image: "img/Coleccion1.jpg" },
    { id: 2, name: "Audifonos", price: 200, image: "img/Coleccion2.jpg" },
    { id: 3, name: "Audifonos", price: 100, image: "img/Coleccion3.jpg" },
    { id: 4, name: "Silla", price: 400, image: "img/Coleccion1.jpg" }
];
```

### ✅ 8. Tabla de Productos Implementada
| ID | PRODUCTO | PRECIO |
|----|----------|--------|
| 1  | Reloj    | $300   |
| 2  | Audifonos| $200   |
| 3  | Audifonos| $100   |
| 4  | Silla    | $400   |

### ✅ 9. Input de Filtrado de Productos
- Campo de búsqueda que permite filtrar productos por:
  - Nombre del producto
  - ID del producto
  - Precio
- Filtrado en tiempo real mientras el usuario escribe

### ✅ 10. Botón de Eliminación Individual
- Botón "Eliminar" en cada producto del carrito
- Confirmación modal antes de eliminar
- Actualización automática del total y contador

### ✅ 11. Cálculo del Precio Total
- Suma automática de todos los productos en el carrito
- Actualización en tiempo real al agregar/eliminar productos
- Formato con separadores de miles para mejor legibilidad

### ✅ 12. Botón Vaciar Carrito
- Funcionalidad para eliminar todos los productos del carrito
- Confirmación modal antes de vaciar
- Reseteo completo del estado del carrito

## Funcionalidades Adicionales Implementadas

### 🌟 Persistencia de Datos
- LocalStorage para mantener datos del carrito entre sesiones
- Datos del cliente guardados automáticamente

### 🌟 Experiencia de Usuario Mejorada
- Notificaciones toast para feedback
- Animaciones y efectos hover
- Contador visual en el icono del carrito
- Estados de carrito vacío

### 🌟 Validaciones
- Verificación de datos del cliente antes de comprar
- Confirmaciones para acciones destructivas
- Validación de campos requeridos

### 🌟 Checkout Funcional
- Proceso de compra simulado
- Resumen de orden
- Confirmación de compra

## Estructura de Archivos

```
tienda-online/
├── index.html              # Página principal
├── tienda.html             # Página de productos (principal)
├── carrito.html            # Página del carrito
├── tienda.js               # JavaScript de la tienda
├── carrito.js              # JavaScript del carrito
├── sobre-nosotros.html     # Página sobre nosotros
├── blog.html               # Página de blog
├── contacto.html           # Página de contacto
├── coleccion-*.html        # Páginas de colecciones
├── styles/
│   └── style.css           # Estilos CSS personalizados
├── img/                    # Imágenes del sitio
└── README.md               # Esta documentación
```

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos personalizados y responsive design
- **Bootstrap 5.3.0**: Framework CSS para componentes UI
- **JavaScript ES6+**: Lógica de aplicación
- **LocalStorage**: Persistencia de datos del lado cliente

## Cómo Usar la Aplicación

1. **Abrir la Tienda**: Navegar a `tienda.html`
2. **Ingresar Datos**: Completar nombre y apellido en la sección cliente
3. **Explorar Productos**: Ver el carousel y navegar por los productos
4. **Filtrar**: Usar el campo de búsqueda para encontrar productos específicos
5. **Agregar al Carrito**: Click en "Agregar al Carrito" en los productos deseados
6. **Ver Carrito**: Click en el icono del carrito para ver los productos agregados
7. **Gestionar Carrito**: Eliminar productos individuales o vaciar todo el carrito
8. **Finalizar Compra**: Click en "Proceder al Pago" para completar la compra

## Características Responsive

- **Mobile First**: Diseño optimizado para dispositivos móviles
- **Breakpoints**: Adaptación automática a diferentes tamaños de pantalla
- **Touch Friendly**: Botones y elementos optimizados para touch
- **Performance**: Carga rápida y eficiente de recursos

## Navegación del Sitio

- **Home** (`index.html`): Página principal con hero section y colecciones
- **Shop** (`tienda.html`): Tienda principal con productos y funcionalidades
- **Carrito** (`carrito.html`): Gestión del carrito de compras
- **Sobre Nosotros**: Información de la empresa
- **Blog**: Sección de blog (estructura lista)
- **Contacto**: Información de contacto

Este proyecto cumple con todos los requerimientos solicitados y agrega funcionalidades adicionales para una experiencia de usuario completa y profesional.
