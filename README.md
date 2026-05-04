# Trámite GO - Sitio Web

Sitio web profesional para **Trámite GO**, servicio de asesoría migratoria y documental.

## 📁 Estructura del proyecto

```
tramite-go/
├── index.html                 # Página principal (todas las secciones)
├── styles.css                 # Estilos del sitio completo
├── script.js                  # Lógica del evaluador y promociones
├── assets/
│   └── logo.svg              # Logo de la marca (puedes reemplazarlo)
├── blog/
│   ├── requisitos-pasaporte-americano-2026.html
│   ├── visa-humanitaria-guia.html
│   └── sentri-global-entry-diferencias.html
└── README.md                  # Este archivo
```

## 🚀 Cómo verlo en tu computadora

Abre el archivo `index.html` con doble clic, o arrastra el archivo a tu navegador.

## 🌐 Cómo publicarlo en internet (GRATIS)

### Opción 1: Vercel (Recomendado, igual que tu sistema interno)

1. Crea cuenta en https://vercel.com (puedes usar tu GitHub o correo)
2. Clic en **"Add New Project"** → **"Import"**
3. Sube la carpeta `tramite-go` completa o conéctala desde GitHub
4. Vercel detectará automáticamente que es un sitio estático
5. Clic en **"Deploy"** y listo en 30 segundos
6. Te dará una URL como `tramite-go-web.vercel.app`

### Opción 2: Netlify

1. Ve a https://app.netlify.com/drop
2. Arrastra la carpeta `tramite-go` completa al navegador
3. Listo. Te genera la URL automáticamente.

### Opción 3: Conectar tu dominio propio

Una vez desplegado en Vercel o Netlify, puedes:
1. Comprar un dominio (ej. `tramitego.mx`) en Namecheap, GoDaddy, etc.
2. En tu panel de Vercel/Netlify, agregar el dominio personalizado
3. Configurar los DNS según las instrucciones (toma ~10 minutos)

## ✏️ Cómo personalizar contenido

### Cambiar el logo
Reemplaza el archivo `assets/logo.svg` con tu logo real (puede ser .svg, .png o .jpg).
Si usas otro formato, cambia las referencias en `index.html` y los archivos del blog.

### Cambiar precios o descripciones de servicios
Abre `index.html` y busca la sección `<!-- ===== SERVICIOS ===== -->`.
Cada servicio es una `<div class="service-card">` que puedes editar.

### Agregar un nuevo blog
1. Copia uno de los archivos en `blog/` (ej. `requisitos-pasaporte-americano-2026.html`)
2. Renómbralo (ej. `nuevo-articulo.html`)
3. Edita el contenido (título, meta tags, texto)
4. Agrégalo en la sección de blog en `index.html` como nueva tarjeta

### Cambiar promociones rotativas
Abre `script.js` y edita el arreglo `promociones` al inicio del archivo.

### Agregar testimonios
Abre `index.html` y busca `<!-- ===== TESTIMONIOS ===== -->`.
Copia y pega un `<div class="testimonial-card">` y edita los datos.

## 📩 Conectar el formulario para recibir leads

Actualmente el evaluador guarda los datos en `localStorage` (solo para pruebas).
Para recibir los leads en tu correo o sistema, tienes 3 opciones:

### Opción A: Formspree (lo más fácil)
1. Crea cuenta en https://formspree.io (plan gratuito hasta 50 envíos/mes)
2. Copia tu endpoint (ej. `https://formspree.io/f/abcd1234`)
3. En `script.js`, busca la sección comentada `INTEGRACIÓN CON FORMSPREE`
4. Descomenta el código y reemplaza `TU_ENDPOINT_AQUI` con tu endpoint
5. Listo: cada lead te llegará a tu correo

### Opción B: Web3Forms (gratis ilimitado)
Similar a Formspree. Visita https://web3forms.com

### Opción C: Conectar con tu sistema interno
Ya tienes `tramite-go.vercel.app/captura`. Podríamos modificar el `script.js`
para que envíe los datos directo a tu API. Avísame si quieres esta integración.

## 📞 Datos de contacto en el sitio

- **WhatsApp:** +52 1 664 529 8312
- **Correo:** tramitesgomx@gmail.com

Si cambian, actualízalos en:
- `script.js` (variables `WHATSAPP_NUMBER` y `COMPANY_EMAIL`)
- `index.html` (sección de contacto y footer)

## 🎨 Colores de marca

Definidos como variables CSS en `styles.css`:
- Primary (verde teal): `#2D7873`
- Primary dark: `#1F5A56`
- Primary light: `#4A9994`

Si quieres cambiarlos, edita las variables en `:root` al inicio del CSS.

## 🔍 SEO incluido

- Meta tags optimizados en cada página
- Keywords relacionadas con trámites migratorios
- Open Graph para compartir en redes
- Estructura semántica HTML5
- Diseño responsivo (móvil, tablet, escritorio)
- Tiempos de carga rápidos (sin frameworks pesados)

## 🛠️ Próximos pasos sugeridos

- [ ] Reemplazar el logo SVG con tu archivo original (PNG/SVG)
- [ ] Actualizar testimonios reales conforme tengas clientes
- [ ] Conectar Formspree o tu sistema interno para recibir leads
- [ ] Agregar tu dominio personalizado en Vercel
- [ ] Crear más artículos de blog para SEO
- [ ] Agregar Google Analytics para medir tráfico
- [ ] Verificar el sitio en Google Search Console

---

© 2026 Trámite GO
