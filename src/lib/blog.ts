/**
 * Blog categories. The id goes in each note's `category:` field and in its URL (/blog/categoria/<id>).
 * Each category wears one of the four brand colours: on the blog, colour is the map.
 * Order here is the order of the band. A category with no published notes is hidden.
 */
export const categories = [
  { id: 'noticias', label: 'Noticias', color: 'var(--color-blue)', intro: 'Lo nuevo en Tato Studio y en las apps con las que hago los videos, contado corto.' },
  { id: 'prompts', label: 'Prompts', color: 'var(--color-red)', intro: 'Los prompts de mis videos, listos para copiar, y por qué funcionan.' },
  { id: 'herramientas', label: 'Herramientas', color: 'var(--color-yellow)', intro: 'Lo que cambia en cada app y cómo se nota en los videos.' },
  { id: 'personajes', label: 'Personajes', color: 'var(--color-green)', intro: 'Cómo armo a los personajes y cómo hago que se vean igual de un video a otro.' },
] as const;

export type CategoryId = (typeof categories)[number]['id'];

/** For the content schema: a note without `category` counts as a news item. */
export const categoryIds = categories.map((c) => c.id) as [CategoryId, ...CategoryId[]];
export const defaultCategory: CategoryId = 'noticias';

export const getCategory = (id: string) => categories.find((c) => c.id === id);
export const categoryHref = (id: string) => `/blog/categoria/${id}`;

/** The note's date as written in its file. UTC on purpose: built on a computer in Lima, local time would show the day before. */
export const fmtDate = (d: Date) => d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** Minutes to read, at about 200 words a minute. Never less than 1. */
export const readingTime = (text = '') => Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
