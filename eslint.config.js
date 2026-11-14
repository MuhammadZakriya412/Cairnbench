import js from '@eslint/js';
import tseslint from 'typescript-eslint';

const noEslintDisablePlugin = {
  rules: {
    'no-eslint-disable': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow eslint-disable comments per R5 and Card 0.1',
        },
        schema: [],
      },
      create(context) {
        return {
          Program() {
            const comments = context.sourceCode.getAllComments();
            for (const comment of comments) {
              if (/eslint-disable/i.test(comment.value)) {
                context.report({
                  loc: comment.loc,
                  message: 'eslint-disable comments are forbidden by project rules (R5).',
                });
              }
            }
          },
        };
      },
    },
  },
};

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'playwright-report/**', 'test-results/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,mjs}'],
    plugins: {
      cairnbench: noEslintDisablePlugin,
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': true,
          'ts-ignore': true,
          'ts-nocheck': true,
          'ts-check': false,
        },
      ],
      'no-console': 'error',
      'cairnbench/no-eslint-disable': 'error',
    },
  },
  {
    files: ['scripts/**/*.{js,mjs,ts}'],
    rules: {
      'no-console': 'off',
    },
  },
);
