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
    "eslint:recommended"
  ],
  rules: {
    'no-control-regex': 'off'
  }
};
