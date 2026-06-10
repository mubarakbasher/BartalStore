module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended'],
  root: true,
  env: { node: true, jest: true },
  ignorePatterns: ['.eslintrc.cjs', 'dist', 'node_modules', 'prisma/migrations'],
  rules: {
    // TS already errors on genuinely undefined identifiers; the core rule
    // false-positives on ambient types (Express namespace, globalThis).
    'no-undef': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  },
};
