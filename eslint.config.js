const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierRecomendado = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  prettierRecomendado,
  {
    // scripts Node do projeto (geracao das imagens)
    files: ['assets/**/*.js'],
    languageOptions: { globals: { __dirname: 'readonly', require: 'readonly' } },
  },
  {
    ignores: ['node_modules/*', '.expo/*', 'dist/*', 'android/*', 'ios/*'],
  },
]);
