'use strict';

module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: false,
      jsx: false,
      experimentalObjectRestSpread: false
    }
  },
  env: {
    node: true,
    browser: true,
    es6: true
  },
  extends: [
    'eslint:recommended'
  ],
  rules: {
    'no-unused-vars': ['error', {
      'argsIgnorePattern': 'next'
    }],
    'no-control-regex': 'off',
    'block-scoped-var': 'error',
    'curly': 'error',
    'eqeqeq': 'error',
    'no-eval': 'error',
    'no-with': 'error',
    'no-undef': 'error',
    'comma-dangle': 'error',
    'consistent-this': ['error', 'self'],
    'no-multiple-empty-lines': 'error'
  }
};
