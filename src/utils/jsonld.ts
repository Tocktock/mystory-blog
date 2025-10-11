type JsonLdNode = Record<string, unknown>;

export interface WebsiteJsonLdInput {
	canonicalUrl: string;
	title: string;
	description: string;
	author: string;
}

export function buildWebsiteJsonLd({
	canonicalUrl,
	title,
	description,
	author,
}: WebsiteJsonLdInput): JsonLdNode {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		url: canonicalUrl,
		name: title,
		description,
		publisher: {
			'@type': 'Person',
			name: author,
		},
	};
}

export interface PersonJsonLdInput {
	canonicalUrl: string;
	name: string;
	description: string;
}

export function buildPersonJsonLd({ canonicalUrl, name, description }: PersonJsonLdInput): JsonLdNode {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name,
		description,
		url: canonicalUrl,
	};
}

export interface ArticleJsonLdInput {
	canonicalUrl: string;
	title: string;
	description: string;
	lang: string;
	datePublished: string;
	dateModified: string;
	author: string;
	imageUrls: readonly string[];
}

export function buildArticleJsonLd({
	canonicalUrl,
	title,
	description,
	lang,
	datePublished,
	dateModified,
	author,
	imageUrls,
}: ArticleJsonLdInput): JsonLdNode {
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: title,
		description,
		inLanguage: lang,
		datePublished,
		dateModified,
		author: {
			'@type': 'Person',
			name: author,
		},
		publisher: {
			'@type': 'Person',
			name: author,
		},
		url: canonicalUrl,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': canonicalUrl,
		},
		image: imageUrls,
	};
}

export interface BreadcrumbItem {
	position: number;
	name: string;
	item: string;
}

export interface BreadcrumbJsonLdInput {
	items: readonly BreadcrumbItem[];
}

export function buildBreadcrumbJsonLd({ items }: BreadcrumbJsonLdInput): JsonLdNode {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map(({ position, name, item }) => ({
			'@type': 'ListItem',
			position,
			name,
			item,
		})),
	};
}
