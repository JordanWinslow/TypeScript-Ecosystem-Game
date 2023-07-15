// The new way of handling config files in ESLint is linked below, but support for typescript isn't documented well yet so we won't be using it.
// https://eslint.org/docs/latest/use/configure/configuration-files-new
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    // https://typescript-eslint.io/linting/typed-linting
    "prettier",
    // https://typescript-eslint.io/linting/troubleshooting/formatting/#suggested-usage---prettier
  ],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    // https://typescript-eslint.io/linting/typed-linting
    project: true,
    ecmaVersion: "latest",
    sourceType: "module",
  },
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  rules: {},
}
