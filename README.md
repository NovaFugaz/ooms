# Proyecto OOMS: Plataforma Web E-Commerce

OOMS es una tienda web de juegos de mesa, TCG, accesorios, TTRPG y rompecabezas. El proyecto corresponde a la primera evaluación y está construido con HTML, CSS y JavaScript, sin backend.

## Integrantes

- Elba Sánchez
- Ignacia Padilla

## Tecnologías

- HTML5
- CSS3
- JavaScript vanilla
- Bootstrap 5.3.3
- Bootstrap Icons
- `localStorage` y `sessionStorage`
- Git y GitHub

## Funcionalidades

### Tienda pública

- Página principal con banners y productos destacados.
- Catálogo dinámico generado mediante JavaScript.
- Búsqueda de productos.
- Filtros por categoría y subcategoría.
- Vista de detalle de producto.
- Registro de usuarios.
- Inicio de sesión.
- Carrito lateral y página completa del carrito.
- Agregar, modificar y eliminar productos del carrito.
- Control de stock.
- Finalización de compra simulada.

### Administración

- CRUD de productos.
- CRUD de usuarios.
- Filtros, búsqueda y estadísticas administrativas.
- Gestión de estados y roles de usuarios.
- Persistencia de productos y usuarios mediante `localStorage`.

Cuenta demo para mostrar el panel administrativo:

- Correo: `admin@ooms.cl`
- Contraseña: `Admin123!`

La cuenta se crea automáticamente en `ooms_users` si todavía no existe ningún usuario con rol administrador.

## Persistencia local

El proyecto utiliza claves independientes para separar la información:

| Clave | Contenido |
| --- | --- |
| `ooms_products` | Productos del catálogo |
| `ooms_users` | Usuarios registrados y administrados |
| `ooms_cart` | Productos y cantidades del carrito |
| `ooms_current_user` | Sesión del usuario recordado |

Los datos se guardan con `JSON.stringify()` y se recuperan con `JSON.parse()`.

## Estructura del repositorio

```text
ooms/
├── README.md
└── frontend/
    ├── index.html
    ├── css/
    │   ├── admin.css
    │   └── styles.css
    ├── img/
    │   ├── banner-1.jpg
    │   ├── banner-2.jpeg
    │   ├── banner-3.jpg
    │   └── logo.webp
    ├── js/
    │   ├── admin-productos.js
    │   ├── admin-usuarios.js
    │   ├── auth.js
    │   ├── carrito.js
    │   ├── login.js
    │   ├── registro.js
    │   ├── script.js
    │   └── storage.js
    ├── vista-admin/
    │   ├── gestion-productos.html
    │   └── gestion-usuarios.html
    └── vista-usuario/
        ├── carrito.html
        ├── contacto.html
        ├── detalle-blog.html
        ├── detalle-producto.html
        ├── login.html
        ├── nosotras.html
        ├── productos.html
        └── registro.html
```

## Responsabilidad de los archivos JavaScript

| Archivo | Responsabilidad |
| --- | --- |
| `storage.js` | API de persistencia para productos, usuarios y carrito |
| `carrito.js` | Catálogo público, detalle, carrito y checkout simulado |
| `auth.js` | Registro, login, sesión y cierre de sesión |
| `registro.js` | Validación y envío del formulario de registro |
| `login.js` | Validación y envío del formulario de inicio de sesión |
| `script.js` | Buscador general del sitio |
| `admin-productos.js` | CRUD administrativo de productos |
| `admin-usuarios.js` | CRUD administrativo de usuarios |

## Cómo ejecutar

1. Clona o descarga el repositorio.
2. Abre la carpeta en VS Code.
3. Abre `frontend/index.html` en el navegador o utiliza una extensión como Live Server.
4. Para revisar directamente las vistas principales:
   - Tienda: `frontend/index.html`
   - Catálogo: `frontend/vista-usuario/productos.html`
   - Carrito: `frontend/vista-usuario/carrito.html`
   - Administración de productos: `frontend/vista-admin/gestion-productos.html`
   - Administración de usuarios: `frontend/vista-admin/gestion-usuarios.html`

## Mejoras futuras

- Incorporar un backend y una base de datos real.
- Implementar autenticación segura del lado del servidor.
- Integrar un proveedor de pagos.
- Migrar la interfaz a React cuando el proyecto lo requiera.
