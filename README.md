README.md

-


	# Infantil & Muebles JR 🪑✨

	Sitio web oficial para una tienda de muebles infantiles, de jardín, cocina y hogar.  
	Diseño artesanal, catálogo interactivo, carrito de compras y sistema de apartado/pagos.

	---

	## 🚀 Tecnologías

	- **HTML5 / CSS3 / JavaScript Vanilla** – Sin frameworks pesados.
	- **Diseño responsivo** – Adaptado a móviles, tablets y escritorio.
	- **LocalStorage** – Carrito de compras persistente y gestión de pedidos.
	- **JSON dinámico** – Productos, equipo y configuración editables sin tocar HTML.
	- **Fuentes externas** – Google Fonts (Cormorant Garamond + DM Sans).
	- **Efectos visuales** – Partículas ambientales, textura de ruido, animaciones suaves.

	---

	## 📁 Estructura del proyecto

	```console
	IMJR-WEB/
	├── assets/
	│   ├── css/               # tokens, main, components, fx
	│   ├── js/                # main, agenda, particles
	│   ├── img/               # banners, equipo, productos, logo, iconos
	│   └── fonts/             # (opcional, actualmente no usado)
	├── data/
	│   ├── config.json        # datos de contacto, horarios, redes
	│   ├── productos.json     # catálogo completo de productos
	│   └── equipo.json        # miembros del equipo
	├── scripts/               # utilidades PowerShell (auditoría, fixes)
	├── docs/log/              # logs de auditoría (generados automáticamente)
	├── index.html             # panel de control / landing principal
	├── salecar.html           # tienda con carrito y filtros
	├── colecciones.html       # exploración por categorías
	├── catalogo-landingpage.html # vista completa del catálogo
	├── nosotros.html          # equipo, historia, valores
	├── paypage.html           # checkout y apartado de pedidos
	├── funnel.html            # embudo interactivo (efecto abanico)
	├── imjr_banner_generator.html # herramienta interna de banners
	├── allproducts.html       # grid alternativo de productos
	├── servicios-landingpage.html # landing de servicios
	├── papernews.html         # monitor de ventas (demo)
	├── 404.html               # página de error personalizada
	├── robots.txt
	├── sitemap.xml
	└── README.md
	```

	---

	## 🛠️ Funcionalidades clave

	### 🛒 Carrito de compras (`salecar.html`)
	- Productos cargados desde `data/productos.json`.
	- Filtros por categoría (infantil, escolar, hogar, jardín, cocina).
	- Carrito persistente en `localStorage`.
	- Envío del pedido por WhatsApp con resumen automático.

	### 💳 Apartado y pagos (`paypage.html`)
	- Selección de porcentaje de apartado (35% – 100%).
	- Generación de código OXXO con temporizador de 24h.
	- Integración simulada con Mercado Pago.
	- Comprobante descargable en texto plano.
	- Registro de pedidos en `localStorage`.

	### 🎨 Embudo interactivo (`funnel.html`)
	- Logo animado que se despliega en un abanico con 4 categorías.
	- Cambia el fondo y muestra partículas ambientales.
	- Cada card redirige a la sección correspondiente del catálogo.

	### 🧑‍🤝‍🧑 Equipo dinámico (`nosotros.html`)
	- Los miembros se cargan desde `data/equipo.json`.
	- Imágenes con fallback automático y altura ajustable.
	- Estadísticas animadas.

	### 🖼️ Carrusel de banners (`salecar.html`)
	- Detecta automáticamente los archivos `banner01.jpg` … `bannerXX.jpg`.
	- No requiere lista fija; escanea la carpeta `assets/img/banners/`.
	- Botones anterior/siguiente y autoplay.

	### 🧹 Herramientas de mantenimiento (scripts PowerShell)
	- `DirGlobalTest.ps1` – Auditoría completa (enlaces rotos, huérfanos, duplicados, residuos).
	- `DirUltraFixRoot.ps1` – Corrección automática de todos los problemas detectados.
	- `UpdateHomeButtonAndFavicon.ps1` – Inyecta botón HOME flotante con PNG/ICO.

	---

	## ⚙️ Configuración rápida

	1. **Clona o descarga** el repositorio en `C:\Proyectos\IMJR-WEB` (o cualquier ruta).
	2. **Edita** `data/config.json` con tus propios datos (WhatsApp, dirección, email).
	3. **Ajusta** `data/productos.json` para agregar/modificar productos.
	4. **Ejecuta** el servidor local (opcional pero recomendado):

	   ```bash
	   cd C:\Proyectos\IMJR-WEB
	   python -m http.server 8000
	   ```
	5. Abre `http://localhost:8000` en tu navegador.

	---

	## 🧪 Pruebas y auditoría

	Para mantener el proyecto limpio, ejecuta periódicamente:

	```shell
	# Auditoría completa
	.\scripts\DirGlobalTest.ps1

	# Reparación automática (sin respaldo, asume que tienes tu propio ZIP)
	.\scripts\DirUltraFixRoot.ps1
	```

	Los logs se guardan en `docs/log/`.

	---

	## 📦 Despliegue

	Puedes subir todo el contenido a cualquier hosting estático (GitHub Pages, Netlify, Vercel, o tu propio servidor Apache/Nginx).  
	Asegúrate de que el servidor sirva `index.html` como página principal y respete las rutas relativas.

	---

	## 👥 Créditos

	- **Diseño y desarrollo** – OSTP @echoShift  
	- **Pipeline** – Leviatan / Quantum Sys  
	- **Cliente** – Infantil & Muebles JR  
	- **Fecha** – 2026

	---

	## 📄 Licencia

	Propietaria – Todos los derechos reservados.  
	El código fuente es confidencial y no se permite su redistribución sin autorización expresa.

	---

	> 🪑 Muebles con amor – Calidad, diseño y calidez para toda la familia.
	```