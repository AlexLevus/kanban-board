module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-use-before-define': 0,
    'linebreak-style': 0,
    'comma-dangle': 0,
    'prefer-template': 0,
    'arrow-parens': 0,
    'semi': 0
  },
};
