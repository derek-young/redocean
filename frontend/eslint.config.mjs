import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

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
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
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
