import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import eslintPluginLocalRules from "./.eslint-local-rules/index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "jsx-a11y": (await import("eslint-plugin-jsx-a11y")).default,
      import: (await import("eslint-plugin-import")).default,
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/types/__generated__/*",
    ],
  },
  {
    files: ["**/*.tsx", "**/*.jsx"],
    plugins: {
      "local-rules": eslintPluginLocalRules,
    },
    rules: {
      "local-rules/require-name-attribute": "error",
    },
  },
  {
    files: ["**/*.tsx", "**/*.jsx", "**/*.ts", "**/*.js"],
    rules: {
      // Import sorting rules
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/no-duplicates": "error",
      "import/no-unresolved": "off", // TypeScript handles this
      "import/named": "off", // TypeScript handles this
      "import/default": "off", // TypeScript handles this
      "import/namespace": "off", // TypeScript handles this
    },
  },
  {
    files: ["**/*.tsx", "**/*.jsx"],
    rules: {
      // Require aria-label or aria-labelledby on form controls
      "jsx-a11y/control-has-associated-label": [
        "error",
        {
          labelAttributes: ["aria-label", "aria-labelledby"],
          controlComponents: ["input", "textarea", "select"],
          ignoreElements: ["button"],
        },
      ],
      // Allow either nesting, id, or aria-label/aria-labelledby
      "jsx-a11y/label-has-associated-control": [
        "error",
        {
          labelAttributes: ["aria-label", "aria-labelledby"],
          controlComponents: ["input", "textarea", "select"],
        },
      ],
      "jsx-a11y/label-has-for": "off",
    },
  },
];

export default eslintConfig;
