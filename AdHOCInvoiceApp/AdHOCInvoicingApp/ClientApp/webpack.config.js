// webpack.config.js

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const million = require('million/compiler');

module.exports = ({ mode } = { mode: "production" }) => {
    console.log(`mode is: ${mode}`);

    return {
        mode,
        entry: "./src/index.js",
        output: {
            publicPath: "/",
            path: path.resolve(__dirname, "build"),
            filename: "bundled.js"
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./public/index.html"
            }),
             million.webpack({ auto: true }),
        ],
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader', // Step3. Injects common JS to DOM
                    'css-loader',    // Step2. Turns CSS into common JS
                    'sass-loader'   // Step1. Turns SASS into valid CSS
                ]
            }
        ]
    }
};