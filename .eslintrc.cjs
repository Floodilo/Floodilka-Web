/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      alias: {
        map: [
          ['@renderer', './packages/renderer/src'],
          ['@shared', './packages/shared/src'],
          ['@app/web', './apps/web/src']
        ],
        extensions: ['.js', '.jsx']
      }
    }
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'prettier'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'import/no-extraneous-dependencies': [
      'warn',
      {
        devDependencies: true
      }
    ]
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/', '*.config.js'],
  overrides: [
    {
      files: ['*.config.cjs', '*.config.js', '*.config.mjs'],
      env: {
        node: true
      }
    }
  ]
};
