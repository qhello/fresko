import { findUp } from 'find-up'
import deepmerge from 'deepmerge'
import _debug from 'debug'
import jiti from 'jiti'
import type { Configuration, DeepPartial } from './types'

const debug = _debug('fresko:config')

export const CONFIG_FILES = ['fresko.config.ts']
export const LOG_LEVELS = ['debug', 'info', 'warn', 'error', 'silent']

export const declareConfiguration = (config: DeepPartial<Configuration>): DeepPartial<Configuration> => {
  return config
}

export function tryRequire(id: string, rootDir: string = process.cwd()) {
  const _require = jiti(rootDir, { interopDefault: true })
  try {
    return _require(id)
  }
  catch (err: any) {
    if (err.code !== 'MODULE_NOT_FOUND')
      console.error(`Error trying import ${id} from ${rootDir}`, err)

    return {}
  }
}

export async function resolveConfig(defaultOptions: Configuration): Promise<Configuration> {
  const match = await findUp(CONFIG_FILES, { cwd: process.cwd() })

  if (!match)
    return defaultOptions

  debug(`config file found ${match}`)
  const configOptions = tryRequire(match)

  return deepmerge(configOptions, defaultOptions) as Configuration
}
