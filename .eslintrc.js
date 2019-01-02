module.exports = {
    "parserOptions": {
        "ecmaVersion": 6
    },
    "env": {
        "browser": true,
        "node": true
    },
    rules: {
        "quotes": [2, "double", {
            allowTemplateLiterals: true
        }],
        "no-multiple-empty-lines": [2, {
            max: 2
        }]
    }
};