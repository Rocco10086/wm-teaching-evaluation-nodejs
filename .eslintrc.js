/* eslint-disable no-undef */
const path = require('path');


module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  extends: ['stylelint', 'airbnb-base'],
  overrides: [
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      extends: ['plugin:vue/strongly-recommended', 'plugin:vue/recommended'],
    },
  ],
  globals: {
    event: true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: path.resolve(__dirname, './build/webpack.base.js'),
      },
    },
  },
  rules: {
    // FIXME node/no-unsupported-features/es-syntax 在加入stylelint后，无法正确识别alias路径
    'node/no-unsupported-features/es-syntax': 'off',
    // FIXME node/no-missing-import 在加入stylelint后，无法正确识别alias路径
    'node/no-missing-import': 'off',
    'node/no-extraneous-import': 'off',
    'implicit-arrow-linebreak': ['error', 'beside'],
    'max-len': [
      'error',
      {
        code: 120,
      },
    ],
    'object-curly-newline': 'off',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['state','Vue'],
      },
    ],
    'linebreak-style': [0, 'error', 'windows'],
    'arrow-body-style': 'off',
    'no-underscore-dangle': [
      'error',
      {
        allow: [
          'window',
          '__INITIAL_STATE__',
        ],
      },
    ],
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 2,
        maxEOF: 0,
      },
    ],
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: true,
        ignores: [],
      },
    ],
  },
};
