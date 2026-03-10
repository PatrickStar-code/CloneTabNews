import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import jestPlugin from "eslint-plugin-jest";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Base JS
  js.configs.recommended,

  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },

  // React
  {
    ...reactPlugin.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },

  // Jest
  {
    files: ["**/*.test.js", "**/*.spec.js", "**/__tests__/**/*.js"],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
    },
  },
]);
