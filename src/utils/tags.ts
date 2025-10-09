import type { CollectionEntry } from 'astro:content';

export type TagEntry = {
	slug: string;
	label: string;
	posts: CollectionEntry<'blog'>[];
};

const toTagSlug = (label: string) => {
	const trimmed = label.trim();
	if (!trimmed) {
		return null;
	}
	const sanitized = trimmed
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[/]+/g, '-')
		.replace(/-+/g, '-');
	if (!sanitized) {
		return null;
	}
	return encodeURIComponent(sanitized);
};

const fallbackLabelFromSlug = (slug: string) =>
	slug
		.split(/[-_]/g)
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(' ');

export const collectTags = (posts: CollectionEntry<'blog'>[]): TagEntry[] => {
	const tagMap = new Map<string, { label: string; posts: CollectionEntry<'blog'>[] }>();

	for (const post of posts) {
		const fallbackSource = post.id.split('/')[0] ?? 'untagged';
		const fallback = fallbackLabelFromSlug(fallbackSource);
		const labels = post.data.tags.length > 0 ? post.data.tags : [fallback];

		for (const label of labels) {
			const slug = toTagSlug(label);
			if (!slug) continue;
			const entry = tagMap.get(slug);
			if (entry) {
				entry.posts.push(post);
			} else {
				tagMap.set(slug, { label, posts: [post] });
			}
		}
	}

	return Array.from(tagMap.entries())
		.map(([slug, entry]) => ({
			slug,
			label: entry.label,
			posts: entry.posts.sort(
				(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
			),
		}))
		.sort((a, b) => a.label.localeCompare(b.label));
};
