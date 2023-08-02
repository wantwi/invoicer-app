module.exports = {
    env: {
        node: true,
        es6: true,
        browser: true
    },

    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
            modules: true,
            experimentalObjectRestSpread: true
        }
    },
    "plugins": ["react"],
    "rules": {
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error"
    }
}
