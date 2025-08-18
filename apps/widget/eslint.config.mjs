import baseConfig from '../../eslint.config.mjs';

const eslintConfig = [
    ...baseConfig,
    {
        ignores: ['dist']
    }
];

export default eslintConfig;
