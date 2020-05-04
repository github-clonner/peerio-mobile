module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
            experimentalObjectRestSpread: true,
            legacyDecorators: true
        }
    },
    plugins: [ 'typescript', 'babel' ],
    extends: [ 'peerio', 'prettier' ],
    settings: {
        "import/resolver": {
            node: {
                extensions: ['.js', '.ts', '.tsx']
            }
        }
    },
    rules: {
        'global-require': 0,
        'generator-star-spacing': 0,
        'import/extensions': 0,
        'react/prefer-stateless-function': 0,
        'react/jsx-filename-extension': 0,
        'react/sort-comp': 0,
        'react/require-default-props': 0,
        'react/no-array-index-key': 1,
        'react/prop-types': 0,
        'no-mixed-operators': 0,
        'new-cap': 0,
        'prefer-rest-params': 0,
        'no-multi-assign': 0,
        'no-unused-vars': 1,
        'no-await-in-loop': 0,
        'react/no-array-index-key': 0,
        'max-len': 0,
        'space-before-function-paren': 0,
        'babel/semi': 1,
        'import/prefer-default-export': 0,
        'no-restricted-imports': [2, { paths: [{
            name: 'react-native',
            importNames: ['Text'],
            message: 'Do not use react-native Text, use custom-text instead'
        }] }]
    },
    globals: {
        'fetch': false,
        'requestAnimationFrame': false,
        '__DEV__': false,
        '__PROD__': false
    }
};
