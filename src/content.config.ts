import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    role: z.string().default(''),
    tech: z.array(z.string()).default([]),
    year: z.number().optional(),
    featured: z.boolean().default(false),
    links: z.array(z.object({
      label: z.string(),
      url: z.string(),
    })).default([]),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    image: z.string().optional(),
    price: z.string().default(''),
    priceType: z.enum(['quote', 'fixed', 'hourly']).default('quote'),
    category: z.enum(['development', 'consultation', 'art', 'other']).default('other'),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    form: z.object({
      fields: z.array(z.object({
        name: z.string(),
        label: z.string(),
        type: z.enum(['text', 'select', 'textarea', 'number', 'checkbox']),
        options: z.array(z.string()).optional(),
        required: z.boolean().default(false),
      })).default([]),
      addons: z.array(z.object({
        id: z.string(),
        label: z.string(),
        price: z.string(),
      })).default([]),
    }).default({ fields: [], addons: [] }),
  }),
});

export const collections = { projects, services };