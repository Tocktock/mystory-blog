import {
  SITE_AUTHOR,
  SITE_AUTHOR_ALTERNATE_NAMES,
  SITE_AUTHOR_JOB_TITLE,
  SITE_AUTHOR_PROFILES,
} from '../consts';
import { routes } from './routes';

type JsonLdNode = Record<string, unknown>;

/*
  The site has one author. Every page points at the same Person node through a stable
  `@id` on the About page, so search engines see one identity instead of several
  anonymous names.
*/
const personId = (siteUrl: string) => new URL(`${routes.about}#person`, siteUrl).toString();
const websiteId = (siteUrl: string) => new URL('/#website', siteUrl).toString();

/** A short reference to the author, for `author` and `publisher` fields. */
export function buildPersonReference(siteUrl: string): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': personId(siteUrl),
    name: SITE_AUTHOR,
    url: new URL(routes.about, siteUrl).toString(),
  };
}

/** The full author node. Emit it on the home page and inside the About page's ProfilePage. */
export function buildPersonJsonLd(siteUrl: string): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    ...buildPersonReference(siteUrl),
    alternateName: SITE_AUTHOR_ALTERNATE_NAMES,
    jobTitle: SITE_AUTHOR_JOB_TITLE,
    sameAs: SITE_AUTHOR_PROFILES,
  };
}

export interface WebsiteJsonLdInput {
  siteUrl: string;
  title: string;
  description: string;
}

export function buildWebsiteJsonLd({
  siteUrl,
  title,
  description,
}: WebsiteJsonLdInput): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId(siteUrl),
    url: new URL('/', siteUrl).toString(),
    name: title,
    description,
    inLanguage: 'ko',
    publisher: { '@id': personId(siteUrl) },
  };
}

export interface ProfilePageJsonLdInput {
  siteUrl: string;
  canonicalUrl: string;
  title: string;
  description: string;
  lang: string;
}

export function buildProfilePageJsonLd({
  siteUrl,
  canonicalUrl,
  title,
  description,
  lang,
}: ProfilePageJsonLdInput): JsonLdNode {
  const person = { ...buildPersonJsonLd(siteUrl) };
  delete person['@context'];

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: canonicalUrl,
    name: title,
    description,
    inLanguage: lang,
    isPartOf: { '@id': websiteId(siteUrl) },
    mainEntity: person,
  };
}

export interface ArticleJsonLdInput {
  siteUrl: string;
  canonicalUrl: string;
  title: string;
  description: string;
  lang: string;
  datePublished: string;
  dateModified: string;
  imageUrls: readonly string[];
  section?: string;
  keywords?: readonly string[];
}

export function buildArticleJsonLd({
  siteUrl,
  canonicalUrl,
  title,
  description,
  lang,
  datePublished,
  dateModified,
  imageUrls,
  section,
  keywords,
}: ArticleJsonLdInput): JsonLdNode {
  const author = buildPersonReference(siteUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    inLanguage: lang,
    datePublished,
    dateModified,
    author,
    publisher: author,
    url: canonicalUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    isPartOf: { '@id': websiteId(siteUrl) },
    image: imageUrls,
    ...(section ? { articleSection: section } : {}),
    ...(keywords && keywords.length > 0 ? { keywords: keywords.join(', ') } : {}),
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
