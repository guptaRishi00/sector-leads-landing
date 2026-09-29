import tseslint from 'typescript-eslint';

// Same rules as the main app: typescript-eslint's type-checked recommended set.
export default tseslint.config(
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'eslint.config.mjs', '**/*.md'],
  },
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
