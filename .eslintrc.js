module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  env: {
    browser: false,
  },
  plugins: ['import'],
  rules: {
    'max-len': ['error', 100],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'no-mixed-operators': 'off',
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'import/prefer-default-export': 'off'
  },
};