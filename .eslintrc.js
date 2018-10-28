module.exports = {
  env: {
    browser: true,
    commonjs: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 6,
  },
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    quotes: [
      'error',
      'single',
      { allowTemplateLiterals: true, avoidEscape: true },
    ],
    semi: ['error', 'never'],
    'no-var': ['error'],
    'prefer-const': ['error'],
    'prefer-arrow-callback': ['error'],
    'arrow-body-style': ['error', 'as-needed'],
    'func-style': ['error', 'expression'],
    'spaced-comment': ['error', 'always'],
  },
}
