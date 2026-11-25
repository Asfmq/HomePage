// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier'

export default withNuxt(
  {
    rules: {
      // 项目中存在历史遗留的 any，先不阻断，避免一次性大改
      '@typescript-eslint/no-explicit-any': 'off',
      // 页面级组件是 Nuxt 的约定命名
      'vue/multi-word-component-names': 'off'
    }
  },
  // 关闭与 Prettier 冲突的格式类规则
  prettier
)
