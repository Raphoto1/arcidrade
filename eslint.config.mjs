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
    ignores: [
      "src/generated/**",
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**"
    ],
    rules: {
      // Reglas útiles convertidas a warnings para no fallar el build
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": "warn",

      // Desactivaciones específicas
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",

      // Relajando reglas que te estaban molestando
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-wrapper-object-types": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "prefer-const": "warn",
      "import/no-anonymous-default-export": "warn",
    },
  },

  // Reglas específicas para archivos generados por Prisma
  {
    files: ["src/generated/**/*.ts", "src/generated/**/*.js", "src/generated/**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "no-unused-vars": "off",
    },
  },
];
