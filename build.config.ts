import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/cli', 'src/index'],
  rollup: {
    inlineDependencies: true,
    resolve: {
      exportConditions: ['node'], // to allow chalk bundling
    },
  },
  clean: true,
  declaration: true,
})
