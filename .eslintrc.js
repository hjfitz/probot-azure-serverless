module.exports = {
	'env': {
		'es2020': true,
		'node': true
	},
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint'
	],
	'extends': [
		'eslint:recommended',
	],
	'parserOptions': {
		'ecmaVersion': 11,
		'sourceType': 'module'
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		]
	}
}
