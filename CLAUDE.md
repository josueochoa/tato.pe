# tato.pe — notas para Claude Code

Web de Tato Studio en Astro 7 + Tailwind 4. Comandos, estructura y deploy están en `README.md`.
Está conectada a Cloudflare Pages: lo que llega a `main` se publica solo en tato.pe.

## Publicar una noticia o una nota del blog

Cuando Tato pida "publica esta noticia" (o una nota de prompts, herramientas o personajes):

1. Crea `src/content/blog/<slug>.mdx`. El slug es la URL (`tato.pe/blog/<slug>`): minúsculas, sin tildes ni ñ, palabras separadas por guiones. Ejemplo: `taller-en-lima-noviembre`.
2. Empieza el archivo con este encabezado:

   ```mdx
   ---
   title: Título corto, como lo diría Tato
   description: Una o dos líneas. Es lo que se ve en el listado y al compartir el link por WhatsApp.
   date: 2026-10-20
   category: noticias
   cover: /notas/<slug>.jpg
   coverAlt: Qué se ve en la imagen, en una frase
   tags: [tema, otro-tema]
   ---
   ```

   - `category`: una de `noticias`, `prompts`, `herramientas` o `personajes` (la lista vive en `src/lib/blog.ts`). Si falta, la nota queda como `noticias`.
   - `date`: el día de publicación, en formato AAAA-MM-DD. El blog ordena de la más nueva a la más antigua.
   - `cover` y `coverAlt` son opcionales, pero una nota con imagen se ve mucho mejor. La imagen va en `public/notas/`, en JPG, de al menos 1280 px de ancho y de preferencia menos de 300 KB. En el listado se recorta en vertical (4:5) y en la nota en horizontal, así que el sujeto debe ir al centro.
   - Si se cambia una imagen ya publicada, súbela con otro nombre: `/notas/` tiene caché larga y el navegador seguiría mostrando la anterior.
   - `draft: true` guarda la nota sin publicarla.
3. Debajo del encabezado va el texto, en Markdown: párrafos cortos y subtítulos con `##`. Si hay un prompt, va en un bloque de código.
4. Voz: español de Perú, de tú, directo, como habla Tato. Sin anglicismos de marketing, sin "increíble" ni "épico". Precios en soles (S/).
5. No inventes datos, fechas, precios ni citas. Si falta algo, pregúntale a Tato.
6. Revisa con `npm run dev` (http://localhost:4321/blog) y corre `npm run build` antes de hacer commit.
7. El push lo decide Tato. Lo que llega a `main` sale en vivo.

## Categorías

Para agregar o renombrar una categoría, edita `src/lib/blog.ts` (id, nombre y frase de presentación). En la fila de filtros del blog solo aparecen las categorías que tienen notas, y la página `/blog/categoria/<id>` se crea sola con la primera nota.
