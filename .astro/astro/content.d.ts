declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"stories": {
"agile/sabotaging-an-agile-transformation.md": {
	id: "agile/sabotaging-an-agile-transformation.md";
  slug: "agile/sabotaging-an-agile-transformation";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"how-this-blog-was-created/deep-in-the-sea.md": {
	id: "how-this-blog-was-created/deep-in-the-sea.md";
  slug: "how-this-blog-was-created/deep-in-the-sea";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"how-this-blog-was-created/how-indexjs-can-read-mdx.md": {
	id: "how-this-blog-was-created/how-indexjs-can-read-mdx.md";
  slug: "how-this-blog-was-created/how-indexjs-can-read-mdx";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"how-this-blog-was-created/how-post-is-created.md": {
	id: "how-this-blog-was-created/how-post-is-created.md";
  slug: "how-this-blog-was-created/how-post-is-created";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"kotlin-knowledges/operator-question.md": {
	id: "kotlin-knowledges/operator-question.md";
  slug: "kotlin-knowledges/operator-question";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"kotlin-mapper/json-to-object.md": {
	id: "kotlin-mapper/json-to-object.md";
  slug: "kotlin-mapper/json-to-object";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"kotlin-mapper/object-to-json.md": {
	id: "kotlin-mapper/object-to-json.md";
  slug: "kotlin-mapper/object-to-json";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"kotlin-mapper/reflections.md": {
	id: "kotlin-mapper/reflections.md";
  slug: "kotlin-mapper/reflections";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"kubernetes-on-mac/k3s-with-multipass.md": {
	id: "kubernetes-on-mac/k3s-with-multipass.md";
  slug: "kubernetes-on-mac/k3s-with-multipass";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"kubernetes/1_container_and_private_repository.md": {
	id: "kubernetes/1_container_and_private_repository.md";
  slug: "kubernetes/1_container_and_private_repository";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"kubernetes/2_container_and_private_repository_practices.md": {
	id: "kubernetes/2_container_and_private_repository_practices.md";
  slug: "kubernetes/2_container_and_private_repository_practices";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"kubernetes/3._first_encounter_with_kubernetes.md": {
	id: "kubernetes/3._first_encounter_with_kubernetes.md";
  slug: "kubernetes/3_first_encounter_with_kubernetes";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"kubernetes/4.kubernetes_pod_deployment_service.md": {
	id: "kubernetes/4.kubernetes_pod_deployment_service.md";
  slug: "kubernetes/4kubernetes_pod_deployment_service";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"kubernetes/5-2.cicd_and_githubaction.md": {
	id: "kubernetes/5-2.cicd_and_githubaction.md";
  slug: "kubernetes/5-2cicd_and_githubaction";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"kubernetes/5.basic_for_ci_cd.md": {
	id: "kubernetes/5.basic_for_ci_cd.md";
  slug: "kubernetes/5basic_for_ci_cd";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"kubernetes/6.kubernetes_and_eks.md": {
	id: "kubernetes/6.kubernetes_and_eks.md";
  slug: "kubernetes/6kubernetes_and_eks";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"kubernetes/roadmap.md": {
	id: "kubernetes/roadmap.md";
  slug: "kubernetes/roadmap";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"mysql-to-postgres/how-to-use-pgloader.md": {
	id: "mysql-to-postgres/how-to-use-pgloader.md";
  slug: "mysql-to-postgres/how-to-use-pgloader";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"mysql-to-postgres/mysql-to-postgres-realworld.md": {
	id: "mysql-to-postgres/mysql-to-postgres-realworld.md";
  slug: "mysql-to-postgres/mysql-to-postgres-realworld";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"mysql-to-postgres/mysql-versus-postgres.md": {
	id: "mysql-to-postgres/mysql-versus-postgres.md";
  slug: "mysql-to-postgres/mysql-versus-postgres";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"spring-persistence/spring-persistence-1.md": {
	id: "spring-persistence/spring-persistence-1.md";
  slug: "spring-persistence/spring-persistence-1";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"spring-persistence/spring-persistence-2.md": {
	id: "spring-persistence/spring-persistence-2.md";
  slug: "spring-persistence/spring-persistence-2";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"spring/soap-with-retrofit.md": {
	id: "spring/soap-with-retrofit.md";
  slug: "spring/soap-with-retrofit";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
"spring/spring-validate.md": {
	id: "spring/spring-validate.md";
  slug: "spring/spring-validate";
  body: string;
  collection: "stories";
  data: InferEntrySchema<"stories">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
