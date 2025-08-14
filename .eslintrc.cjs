module.exports = {
	env: {
		node: true,
		es2021: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'prettier'],
	rules: {
		'@typescript-eslint/no-var-requires': 'off',
		'no-console': 'warn',
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		'prettier/prettier': ['error', { endOfLine: 'auto' }],
	},
	ignorePatterns: ['dist/*'],
};
