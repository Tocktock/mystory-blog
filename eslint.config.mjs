import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';
import globals from 'globals';

const tsConfigs = tseslint.configs.recommended.map((config) => ({
	...config,
	languageOptions: {
		...config.languageOptions,
		parserOptions: {
			...config.languageOptions?.parserOptions,
			project: './tsconfig.json',
			tsconfigRootDir: import.meta.dirname,
			extraFileExtensions: ['.astro'],
		},
	},
}));

const astroFlatConfigs = astro.configs['flat/recommended'].map((config) => {
	if (config.languageOptions?.parserOptions) {
		return {
			...config,
			languageOptions: {
				...config.languageOptions,
				parserOptions: {
					...config.languageOptions.parserOptions,
					project: './tsconfig.json',
					tsconfigRootDir: import.meta.dirname,
					extraFileExtensions: ['.astro'],
				},
			},
		};
	}
	return config;
});

export default [
	{
		ignores: ['dist/**', '.astro/**', 'node_modules/**', '.reports/**', 'phase*-baseline-*.zip'],
	},
	js.configs.recommended,
	...tsConfigs,
	...astroFlatConfigs,
	{
		files: [
			'**/*.config.{js,cjs,mjs,ts}',
			'scripts/**/*.mjs',
			'tests/**/*.ts',
			'prettier.config.cjs',
			'eslint.config.mjs',
		],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
];
