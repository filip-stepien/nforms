import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

const eslintConfig = [
    {
        ignores: ['dist']
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.strict
];

export default eslintConfig;
