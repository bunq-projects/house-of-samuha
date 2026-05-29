import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const srcsetEntry = z.object({
  src: z.string(),
  width: z.number(),
});

const chefs = defineCollection({
  loader: glob({ pattern: '**/*.json', base: 'src/content/chefs' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    tagline: z.string(),
    bio: z.string(),
    image: z.string(),
    imageSrcset: z.array(srcsetEntry),
    upcomingEvent: z.object({
      name: z.string(),
      slug: z.string(),
    }),
    eventDescription: z.string(),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.json', base: 'src/content/events' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    date: z.string(),
    description: z.string(),
    chef: z.object({
      name: z.string(),
      slug: z.string(),
    }),
    mainImage: z.string(),
    mainImageSrcset: z.array(srcsetEntry),
    chefImage: z.string(),
    chefImageSrcset: z.array(srcsetEntry),
    gallery: z.array(z.object({
      url: z.string(),
      type: z.string(),
    })),
  }),
});

export const collections = { chefs, events };
