module.exports = {
	// https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
	// This option interrupts the configuration hierarchy at this file
	// Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
	root: true,

	// https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser
	// Must use parserOptions instead of "parser" to allow vue-eslint-parser to keep working
	// `parser: 'vue-eslint-parser'` is already included with any 'plugin:vue/**' config and should be omitted
	parserOptions: {
		ecmaVersion: 'latest',
		parser: '@typescript-eslint/parser',
		sourceType: 'module'
	},

	env: {
		browser: true,
		es2021: true,
		node: true,
		webextensions: true
	},

	// Rules order is important, please avoid shuffling them
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:vue/vue3-essential',
		'plugin:prettier/recommended'
	],

	plugins: ['@typescript-eslint', 'vue'],

	globals: {
		NodeJS: true
	},

	// add your custom rules here
	rules: {
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-useless-escape': 0,
		'no-extra-boolean-cast': 0,
		'no-async-promise-executor': 0,
		'@typescript-eslint/no-var-requires': 0,
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-this-alias': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-empty-function': 'off'
	}
};
