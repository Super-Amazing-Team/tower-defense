const { join } = require("path");

module.exports = {
  root: true,
  extends: [
    "airbnb-typescript",
    "react-app",
    "react-app/jest",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
  ],
  plugins: ["import", "react", "prettier", "react-hooks", "@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: join(__dirname, "tsconfig.json"),
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2022,
  },
  env: {
    browser: true,
    es2021: true,
  },
  settings: {
    "import/resolver": {
      alias: {
        extensions: [".ts", ".tsx"],
        map: [["@", join(__dirname, "src")]],
      },
    },
  },
  rules: {
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "import/prefer-default-export": "off",
    "no-plusplus": "off",
    radix: "off",
    "func-names": "off",
    "react/jsx-no-bind": "off",
    "react/jsx-props-no-spreading": "off",
    "react/self-closing-comp": "error",
    "react/prop-types": "off",
    "react/jsx-no-constructed-context-values": "off",
    "no-case-declarations": "off",
    "no-nested-ternary": "off",
    "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
    "no-empty": "off",
    "react/no-array-index-key": "warn",
    "no-param-reassign": "warn",
    "consistent-return": ["error", { treatUndefinedAsUnspecified: true }],
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-debugger": "warn",
    "spaced-comment": ["warn", "always"],
    "no-else-return": "error",
    camelcase: "off",
    "no-underscore-dangle": "off",
    "no-await-in-loop": "off",
    "import/no-mutable-exports": "off",
    "no-unused-vars": "off", // NOTE: we use typescript version of this rule
    "import/order": "warn",
    "react/react-in-jsx-scope": "off",
    "react/display-name": "off",
    "prefer-destructuring": 0,
    "import/no-unresolved": ["error", { caseSensitive: false }],
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "jsx-a11y/no-autofocus": [
      "error",
      {
        ignoreNonDOM: true,
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        vars: "all",
        args: "none",
      },
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "variable",
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
        leadingUnderscore: "allowSingleOrDouble",
      },
      {
        selector: "function",
        format: ["camelCase", "PascalCase"],
        leadingUnderscore: "allowSingleOrDouble",
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
      },
      {
        selector: "interface",
        format: ["PascalCase"],
        prefix: ["I"],
      },
      {
        selector: "typeAlias", // NOTE: Types
        format: ["PascalCase"],
        prefix: ["T"],
      },
      {
        selector: "variable",
        types: ["boolean"],
        format: ["PascalCase"],
        prefix: ["is"],
      },
    ],
    "prettier/prettier": [
      "error",
      {
        tabWidth: 2,
        useTabs: false,
        semi: true,
        singleQuote: false,
        trailingComma: "all",
        printWidth: 80,
      },
    ],
    "no-warning-comments": [
      "warn",
      {
        terms: [
          "BUG",
          "HACK",
          "FIXME",
          "TODO",
          "CHECK",
          "DELETE",
          "FIX",
          "FIXIT",
          "DEL",
          "REMOVE",
          "JUNK",
          "REFACTOR",
        ],
      },
    ],
  },
};
