import type { Configuration } from './types'

export const CONFIG_FILES = ['fresko.config.ts']

export const DEFAULT_CONFIG: Configuration = {
  theme: {
    start: {
      header: 'Fresko',
      subheader: '',
    },
    end: {
      header: '',
      subheader: '',
    },
  },
  default: {
    silent: false,
    env: {
      FORCE_COLOR: 'true', // Enable colors in terminal, for most commands (e.g. npm install)
    },
  },
  prompts: [],
}
