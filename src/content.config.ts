import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    cover: z.string().optional(),      // path under /public, e.g. /poster/afhs-joel.jpg
    coverAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    short: z.string(),
    price: z.number(),
    compareAt: z.number().optional(),
    kind: z.enum(['pack', 'taller', 'curso']),
    available: z.boolean().default(true),
    availableFrom: z.string().optional(),
    when: z.string().optional(),       // for talleres: date and time
    seats: z.number().optional(),
    includes: z.array(z.string()),
    cover: z.string(),
    coverAlt: z.string(),
    cta: z.string().default('Comprar'),
    order: z.number().default(0),
  }),
});

export const collections = { blog, products };
