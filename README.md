# tato.pe

Sitio de Tato Studio (Carlos Quispe): cine con IA hecho en Perú. Astro 7 + Tailwind 4, estático.

## Comandos

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera dist/ con URLs relativas (sirve desde file:// o una subcarpeta)
npm run preview    # sirve dist/
npm run export     # build + tato.pe-static.zip (URLs relativas)
npm run build:cf   # genera dist/ para Cloudflare Pages (URLs desde la raíz, sin reescritura)
npm run export:cf  # build:cf + tato.pe-cloudflare.zip
```

## Publicar en Cloudflare Pages

**Subida directa (sin Git):** en el panel de Pages elige *Upload assets*, descomprime `tato.pe-cloudflare.zip` y arrastra la carpeta `dist/` (o sube el zip con `npx wrangler pages deploy dist --project-name tato-pe`).

**Desde Git:** conecta el repositorio y usa esta configuración.

| Ajuste | Valor |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build:cf` |
| Build output directory | `dist` |
| Variable de entorno | `NODE_VERSION` = `22` |

`public/_headers` define la caché larga para `/_astro`, `/video`, `/poster` y `/found`. Luego apunta el dominio `tato.pe` al proyecto en *Custom domains*.

## Dónde está cada cosa

- `src/pages/index.astro`: la página principal, armada con las secciones de `src/components/home/`.
- `src/lib/site.ts`: WhatsApp, redes, links de afiliado, planes y precios del video personalizado, menú.
- `src/content/products/*.md`: el taller y el pack (precio, cupos, fecha, qué incluye). Cada uno tiene su página en `/aprende/<slug>` y su ticket en la portada.
- `src/content/blog/*.mdx`: notas del blog (`/blog`). Portada opcional en `cover`.
- `src/styles/global.css`: tokens de marca (`@theme`), tipografía, botones y helpers de movimiento.
- `public/video/` y `public/poster/`: clips comprimidos para web y sus fotogramas. Los originales están en `assets/` (fuera de git).
- `public/found/`: fotos de Huaraz, Ica y Lima de Wikimedia Commons con sus créditos en `credits.json` (ya citados en el pie).

## Links (bio)

`/links/` es una pantalla tipo Linktree: avatar, nombre y una columna de botones. Apunta ahí la bio de TikTok, Instagram y el Linktree. Los botones se editan en `src/pages/links/index.astro`.

## Recarga (bio de TikTok)

`/recarga/` es el centro de recarga de energía de servidores y buzón de sugerencias. Todo lo editable está en el objeto `CONFIG` al inicio de `src/pages/recarga.astro`: monto actual, meta, ruta del QR, titular, número Yape, botones de aporte, a dónde se envía el buzón y los últimos mecenas del muro.

- **QR:** guarda tu imagen en `public/assets/qr-yape.png`. Mientras no exista, la tarjeta muestra un recuadro "Aquí va tu QR" y el botón de descarga queda desactivado.
- **Buzón:** `submit.mode = 'whatsapp'` abre un chat con el mensaje armado (funciona sin servidor). Con `'webhook'` o `'both'` y una `webhookUrl`, hace un POST con el JSON `{ handle, recargo, nombreYape, monto, operacion, sugerencia, fecha, origen }`. Para Google Sheets, un Apps Script publicado como aplicación web basta:

```js
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActive().getSheets()[0].appendRow([d.fecha, d.handle, d.recargo, d.nombreYape, d.monto, d.operacion, d.sugerencia]);
  return ContentService.createTextOutput('ok');
}
```

- **Verificar un aporte:** busca en tu historial de Yape un pago con el "Nombre en Yape", el monto y la hora del mensaje. Si coincide, agrega su @ a `recentSupporters` y súbelo a `currentAmount`.
- La suma a la batería y la tarjeta en el muro al enviar son solo visuales para quien envía. Los montos reales se actualizan a mano en `currentAmount` y `recentSupporters` después de verificar el Yape.
- El aviso legal está en `src/components/recarga/Aviso.astro`: no lo edites, debe ir palabra por palabra.

## Carrito

El carrito vive en `localStorage` (`src/scripts/cart.ts`). "Pagar por WhatsApp" arma el pedido con los productos y el total y abre un chat. No hay pasarela de pago: el cobro es por Yape, Plin o tarjeta a mano. Si más adelante se conecta una pasarela (Culqi, Mercado Pago, Stripe), el lugar es `src/pages/carrito.astro`.

## Antes de publicar

- Confirmar precios de los videos personalizados (`plans` en `site.ts`) y la fecha y cupos del taller.
- Reemplazar las opiniones de ejemplo en `src/components/home/Opiniones.astro`.
- Conectar el formulario de correo de "Prompt de la semana" (`src/components/home/Prompt.astro`) a una lista real; hoy abre un `mailto:`.
- Confirmar el link del canal de YouTube en `site.ts`.
- Ajustar `.taste-skill/` o borrarlo: son notas y capturas del proceso de diseño.
