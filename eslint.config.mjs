import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Extensiones base de Next.js y TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Reglas para tu código fuente
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["src/generated/**"],
    rules: {
      // Reglas útiles
      "no-unused-vars": "error",
      "@typescript-eslint/no-unused-vars": "error",

      // Desactivaciones específicas
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",

      // Relajando reglas que te estaban molestando
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-explicit-any": "warn", // puedes poner "off" si prefieres
      "@typescript-eslint/no-require-imports": "off",
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // Reglas específicas para archivos generados por Prisma
  {
    files: ["src/generated/**/*.ts", "src/generated/**/*.js"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "no-unused-vars": "off",
    },
  },
];
