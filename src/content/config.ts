import { defineCollection, z } from 'astro:content';

const storiesCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		publishDate: z.date(),
	}),
});

export const collections = {
	stories: storiesCollection,
};