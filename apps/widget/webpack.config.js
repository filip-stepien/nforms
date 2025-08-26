import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import { env } from '../../packages/env/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src', 'index.ts'),
    output: {
        filename: 'widget.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            configFile: path.resolve(__dirname, '.babelrc.json')
                        }
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    }
                ]
            }
        ]
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            WIDGET_FORM_STRUCTURE_BASE_URL: JSON.stringify(env.WIDGET_FORM_STRUCTURE_BASE_URL),
            WIDGET_FORM_SUBMIT_URL: JSON.stringify(env.WIDGET_FORM_SUBMIT_URL)
        })
    ]
};

export default config;
