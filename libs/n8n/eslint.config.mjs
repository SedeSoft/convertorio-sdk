import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
	{
		ignores: ['node_modules/**', 'dist/**'],
	},
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				project: './tsconfig.json',
			},
		},
		plugins: {
			'@typescript-eslint': typescriptEslint,
		},
		rules: {
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
		},
	},
];
