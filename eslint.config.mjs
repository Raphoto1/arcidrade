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
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-unused-vars": "error",
      "react/react-in-jsx-scope": "off",
      'known-rule': 'error', // Activada
    'unknown-rule': 'off' // Desactivada
    },
  },
];

export default eslintConfig;
