import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/cli', 'src/index'],
  rollup: {
    inlineDependencies: true,
  },
  clean: true,
  declaration: true,
})
