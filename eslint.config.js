import path from 'path';
import { fileURLToPath } from 'url';

import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import javascriptStandardConfig from 'eslint-config-standard';
import nodePlugin from 'eslint-plugin-n';
import promisePlugin from 'eslint-plugin-promise';
import typeScriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptStandardConfig from 'eslint-config-standard-with-typescript';
import reactPlugin from 'eslint-plugin-react';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import jestPlugin from 'eslint-plugin-jest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    plugins: {
      import: importPlugin,
      n: nodePlugin,
      promise: promisePlugin,
    },
    languageOptions: {
      sourceType: 'module',
      parserOptions: {
        project: ['./tsconfig.eslint.json', './tsconfig(.*)?.json'],
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...javascriptStandardConfig.rules,
      semi: ['error', 'always'],
      'space-before-function-paren': ['error', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      }],
      'max-len': ['error', { code: 120 }],
      'comma-dangle': ['error', 'always-multiline'],
      'arrow-parens': ['error', 'always'],
      'no-trailing-spaces': 'error',
      'computed-property-spacing': ['error', 'never'],
      'comma-spacing': ['error', {
        before: false,
        after: true,
      }],
      'space-in-parens': ['error', 'never'],
      'key-spacing': ['error'],
      'object-curly-spacing': ['error', 'always'],
      'no-multi-spaces': ['error'],
      'space-unary-ops': 1,
      'space-infix-ops': ['error', { int32Hint: true }],
      'arrow-spacing': 'error',
      'import/prefer-default-export': 'off',
      'class-methods-use-this': 'off',
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'no-param-reassign': ['error', { props: false }],
      'no-shadow': 'off',
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-namespace': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      react: reactPlugin,
    },
    languageOptions: {
      parser: typeScriptParser,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      ...typescriptStandardConfig.rules,
      // Typescript
      '@typescript-eslint/no-shadow': ['error'],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      '@typescript-eslint/no-namespace': 'off',
      'class-methods-use-this': 'off',

      // JSX
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-closing-bracket-location': ['error'],
      'react/jsx-max-props-per-line': ['error', {
        maximum: { single: 2, multi: 1 },
      }],
      'react/jsx-first-prop-new-line': ['error', 'multiline'],
      'react/jsx-closing-tag-location': ['error'],
      'react/jsx-tag-spacing': ['error', {
        closingSlash: 'never',
        beforeSelfClosing: 'always',
        afterOpening: 'never',
        beforeClosing: 'never',
      }],
      'react/jsx-curly-brace-presence': ['error', { props: 'always', children: 'always' }],
      'react/jsx-curly-newline': ['error'],
      'react/jsx-curly-spacing': ['error'],
      'react/jsx-equals-spacing': ['error'],
      'react/jsx-props-no-multi-spaces': ['error'],
      'react/jsx-newline': ['error', { prevent: true, allowMultilines: false }],
      'react/jsx-one-expression-per-line': ['error', { allow: 'single-child' }],
      'react/self-closing-comp': ['error'],
      'react/jsx-key': ['error'],
      'react/jsx-no-useless-fragment': ['error'],
      'react/jsx-wrap-multilines': ['error', {
        declaration: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
      }],
    },
  },
  {
    files: ['**/*.vue'],
    plugins: {
      vue: vuePlugin,
    },
    languageOptions: {
      parser: vueParser,
      sourceType: 'module',
      parserOptions: {
        // parser: {
        //   js: 'espree',
        //   ts: typescriptPlugin,
        // },
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      ...vuePlugin.configs['vue3-essential'].rules,
      ...vuePlugin.configs['vue3-strongly-recommended'].rules,
      ...vuePlugin.configs['vue3-recommended'].rules,
      'vue/component-tags-order': ['error', {
        order: ['script', 'template', 'style'],
      }],
      'vue/first-attribute-linebreak': ['error', {
        singleline: 'beside',
        multiline: 'below',
      }],
      'vue/max-attributes-per-line': ['error', {
        singleline: {
          max: 2,
        },
        multiline: {
          max: 1,
        },
      }],
      'vue/html-closing-bracket-spacing': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/valid-define-props': 'error',
      'vue/valid-define-emits': 'error',
      'vue/static-class-names-order': 'error',
      'vue/space-in-parens': ['error', 'never'],
      'vue/object-curly-spacing': ['error', 'always'],
      'vue/space-infix-ops': ['error', { int32Hint: true }],
      'vue/arrow-spacing': 'error',
    },
  },
  {
    files: ['**/__mocks__/*.ts', '**/*.e2e-spec.ts', '**/*.spec.ts'],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      // Выключаем правило unbound-method в тестах
      '@typescript-eslint/unbound-method': 'off',
      'jest/unbound-method': 'error',
    },
  },
  {
    ignores: ['**/ws-adapter.adapter.ts', '**/migrations/Migration*.ts'],
  },
];
