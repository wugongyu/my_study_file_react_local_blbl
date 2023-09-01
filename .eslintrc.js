module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'react-hooks',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    }
  },
  rules: {
    // 0|'off' -- 关闭规则，1|'warn' -- 警告，2|'error' -- 报错
    'no-unused-vars': 1,
    'react/display-name': 1,
    'react/prop-types': 1,
    'no-console': 'off',
  },
  settings: {
    react: {
      version: '16.8.6'
    }
  },
}