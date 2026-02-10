type JsonLdNode = Record<string, unknown>;

export interface WebsiteJsonLdInput {
	canonicalUrl: string;
	title: string;
	description: string;
	author: string;
	searchUrlTemplate?: string;
}

export function buildWebsiteJsonLd({
	canonicalUrl,
	title,
	description,
	author,
	searchUrlTemplate,
}: WebsiteJsonLdInput): JsonLdNode {
	const node: JsonLdNode = {
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

	if (searchUrlTemplate) {
		node.potentialAction = {
			'@type': 'SearchAction',
			target: searchUrlTemplate,
			'query-input': 'required name=search_term_string',
		};
	}

	return node;
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

export interface WebPageJsonLdInput {
	canonicalUrl: string;
	title: string;
	description: string;
	lang: string;
	type?: 'WebPage' | 'CollectionPage' | 'AboutPage' | 'SearchResultsPage' | 'ImageGallery';
}

export function buildWebPageJsonLd({
	canonicalUrl,
	title,
	description,
	lang,
	type = 'WebPage',
}: WebPageJsonLdInput): JsonLdNode {
	return {
		'@context': 'https://schema.org',
		'@type': type,
		name: title,
		description,
		inLanguage: lang,
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

export interface ItemListItem {
	name: string;
	url: string;
	description?: string;
}

export interface ItemListJsonLdInput {
	name: string;
	items: readonly ItemListItem[];
}

export function buildItemListJsonLd({ name, items }: ItemListJsonLdInput): JsonLdNode {
	return {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name,
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			url: item.url,
			name: item.name,
			...(item.description ? { description: item.description } : {}),
		})),
	};
}
