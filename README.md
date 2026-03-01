# Frontsportin

Aplicación web frontend desarrollada con **Angular** para el sistema de gestión deportiva **Gesportin**. Permite administrar clubes, equipos, jugadores, ligas, partidos, noticias, artículos de tienda y toda la operativa asociada a la gestión de un club deportivo.

---

## Tabla de contenidos

1. [Descripción](#descripción)
2. [Tecnologías utilizadas](#tecnologías-utilizadas)
3. [Requisitos previos](#requisitos-previos)
4. [Instalación](#instalación)
5. [Ejecución](#ejecución)
6. [Scripts disponibles](#scripts-disponibles)
7. [Estructura del proyecto](#estructura-del-proyecto)
8. [Módulos principales](#módulos-principales)
9. [Rutas de la aplicación](#rutas-de-la-aplicación)
10. [Referencia de la API](#referencia-de-la-api)

---

## Descripción

**Frontsportin** es la capa de presentación del sistema Gesportin. Consume una API REST Spring Boot expuesta en `http://localhost:8089` y ofrece una interfaz completa de administración para:

- Gestión de usuarios, roles y tipos de usuario
- Administración de clubes, temporadas, categorías y equipos
- Seguimiento de jugadores, ligas y partidos
- Portal de noticias con comentarios y puntuaciones
- Tienda de artículos con carrito de compra, facturas y compras
- Control de cuotas y pagos de jugadores

---

## Tecnologías utilizadas

| Tecnología | Versión |
|---|---|
| Angular | ^20.3.0 |
| Angular Material | ^20.2.14 |
| Angular CDK | ^20.2.14 |
| Bootstrap | ^5.3.8 |
| Bootstrap Icons | ^1.13.1 |
| RxJS | ~7.8.0 |
| TypeScript | ~5.9.2 |
| Node.js | ≥18 (recomendado LTS) |

---

## Requisitos previos

- [Node.js](https://nodejs.org/) ≥ 18
- [Angular CLI](https://angular.io/cli) instalado globalmente:
  ```bash
  npm install -g @angular/cli
  ```
- El backend **Gesportin** corriendo en `http://localhost:8089`

---

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd frontsportincali4

# Instalar las dependencias
npm install
```

---

## Ejecución

```bash
# Servidor de desarrollo (http://localhost:4200)
npm start
```

La aplicación se recargará automáticamente al detectar cambios en los ficheros fuente.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Lanza el servidor de desarrollo en `http://localhost:4200` |
| `npm run build` | Compila la aplicación para producción en `/dist` |
| `npm run watch` | Compila en modo desarrollo con recarga automática |
| `npm test` | Ejecuta los tests unitarios con Karma/Jasmine |

---

## Estructura del proyecto

```
src/
├── app/
│   ├── component/          # Componentes organizados por entidad
│   │   ├── articulo/
│   │   ├── carrito/
│   │   ├── categoria/
│   │   ├── club/
│   │   ├── comentario/
│   │   ├── comentarioart/
│   │   ├── compra/
│   │   ├── cuota/
│   │   ├── equipo/
│   │   ├── factura/
│   │   ├── jugador/
│   │   ├── liga/
│   │   ├── noticia/
│   │   ├── pago/
│   │   ├── partido/
│   │   ├── puntuacion/
│   │   ├── rolusuario/
│   │   ├── shared/         # Componentes compartidos (home, nav, etc.)
│   │   ├── temporada/
│   │   ├── tipoarticulo/
│   │   ├── tipousario/
│   │   └── usuario/
│   ├── environment/        # Variables de entorno
│   ├── model/              # Interfaces y modelos de datos
│   ├── pipe/               # Pipes personalizados
│   ├── service/            # Servicios HTTP por entidad
│   ├── app.config.ts
│   ├── app.routes.ts       # Definición de rutas
│   └── app.ts
├── styles.css
└── index.html
```

---

## Módulos principales

Cada entidad sigue una convención de carpetas dentro de `component/`:

| Carpeta | Propósito |
|---|---|
| `plist-admin-routed/` | Listado paginado (tabla con filtros) |
| `view-admin-routed/` | Vista de detalle de un registro |
| `new-admin-routed/` | Formulario de creación |
| `edit-admin-routed/` | Formulario de edición |
| `delete-admin-routed/` | Confirmación de borrado |

---

## Rutas de la aplicación

A continuación se listan las rutas principales de la SPA:

| Ruta | Componente |
|---|---|
| `/` | Home |
| `/usuario` | Listado de usuarios |
| `/usuario/view/:id` | Detalle de usuario |
| `/usuario/new` | Nuevo usuario |
| `/usuario/edit/:id` | Editar usuario |
| `/club` | Listado de clubes |
| `/club/new` | Nuevo club |
| `/club/view/:id` | Detalle de club |
| `/temporada` | Listado de temporadas |
| `/categoria` | Listado de categorías |
| `/equipo` | Listado de equipos |
| `/jugador` | Listado de jugadores |
| `/liga` | Listado de ligas |
| `/partido` | Listado de partidos |
| `/noticia` | Listado de noticias |
| `/comentario` | Listado de comentarios |
| `/puntuacion` | Listado de puntuaciones |
| `/articulo` | Listado de artículos |
| `/tipoarticulo` | Tipos de artículo |
| `/carrito` | Carrito de compra |
| `/factura` | Facturas |
| `/compra` | Compras |
| `/cuota` | Cuotas |
| `/pago` | Pagos |
| `/rolusuario` | Roles de usuario |
| `/tipousuario` | Tipos de usuario |
| `/comentarioart` | Comentarios de artículos |

---

## Referencia de la API

La documentación completa de todos los endpoints REST del backend se encuentra en [`api.md`](./api.md).

- **Base URL:** `http://localhost:8089`
- **Autenticación:** `POST /session/login` — devuelve un token que debe incluirse en las peticiones.
- **CORS:** habilitado para todos los orígenes.
