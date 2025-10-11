module.exports = {
	printWidth: 100,
	singleQuote: true,
	trailingComma: 'all',
	tabWidth: 2,
	useTabs: false,
	plugins: ['prettier-plugin-astro'],
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
	],
};
