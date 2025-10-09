type EnvValue = string | boolean | undefined;

export interface GiscusConfig {
	repo?: string;
	repoId?: string;
	category?: string;
	categoryId?: string;
	mapping: string;
	lang: string;
	theme: string;
	strict: string;
	reactionsEnabled: string;
	emitMetadata: string;
	inputPosition: string;
	loading: string;
}

export type ConfiguredGiscus = GiscusConfig &
	Required<Pick<GiscusConfig, 'repo' | 'repoId' | 'category' | 'categoryId'>>;

const readEnv = (value: EnvValue): string | undefined => {
	if (typeof value !== 'string') {
		return undefined;
	}

	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : undefined;
};

export function buildGiscusConfig(env: Record<string, EnvValue>): GiscusConfig {
	return {
		repo: readEnv(env.PUBLIC_GISCUS_REPO),
		repoId: readEnv(env.PUBLIC_GISCUS_REPO_ID),
		category: readEnv(env.PUBLIC_GISCUS_CATEGORY),
		categoryId: readEnv(env.PUBLIC_GISCUS_CATEGORY_ID),
		mapping: readEnv(env.PUBLIC_GISCUS_MAPPING) ?? 'title',
		lang: readEnv(env.PUBLIC_GISCUS_LANG) ?? 'ko',
		theme: readEnv(env.PUBLIC_GISCUS_THEME) ?? 'light',
		strict: readEnv(env.PUBLIC_GISCUS_STRICT) ?? '1',
		reactionsEnabled: readEnv(env.PUBLIC_GISCUS_REACTIONS_ENABLED) ?? '1',
		emitMetadata: readEnv(env.PUBLIC_GISCUS_EMIT_METADATA) ?? '0',
		inputPosition: readEnv(env.PUBLIC_GISCUS_INPUT_POSITION) ?? 'bottom',
		loading: readEnv(env.PUBLIC_GISCUS_LOADING) ?? 'lazy',
	};
}

export function getConfiguredGiscus(config: GiscusConfig): ConfiguredGiscus | undefined {
	if (config.repo && config.repoId && config.category && config.categoryId) {
		return config as ConfiguredGiscus;
	}

	return undefined;
}
