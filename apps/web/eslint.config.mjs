import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import unusedImports from 'eslint-plugin-unused-imports';
import baseConfig from '../../eslint.config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname
});

const eslintConfig = [
    ...baseConfig,
    {
        ignores: ['src/db/prisma/generated/**']
    },
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
        plugins: {
            'unused-imports': unusedImports
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'warn',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_'
                }
            ]
        }
    }
];

export default eslintConfig;
