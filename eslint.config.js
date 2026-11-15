// @ts-check
const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    files: ['src/api/**/*.js', 'src/shared/**/*.js', 'config/**/*.js'],
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-var': 'error',
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-throw-literal': 'error',
      'no-return-await': 'error',
      'require-await': 'off',
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        process: 'readonly',
        require: 'readonly',
        module: 'writable',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
      },
    },
  },
  {
    files: ['src/web/**/*.js'],
    rules: {
      'no-unused-vars': 'off', // Browser functions called by HTML onclick or cross-script tags
      'no-undef': 'off',       // Global variables shared across script tags
      'no-control-regex': 'off', // Intentional sanitization of corrupted ordinal characters
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-var': 'error',
      'prefer-const': 'warn',
      'eqeqeq': ['warn', 'smart'],
      'curly': ['warn', 'multi-line'],
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        document: 'readonly',
        window: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        console: 'readonly',
        bootstrap: 'readonly',
        navigator: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
      },
    },
  },
  {
    files: ['tests/**/*.js'],
    rules: {
      'no-undef': 'off', // Jest globals
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
    },
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly',
      },
    },
  },
];
