import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  rules: {
    'no-console': 'off',
    'node/prefer-global/process': 0,
    'node/prefer-global/buffer': 0,
  },
}, {
  ignores: [
    '**/node_modules',
  ],
})
