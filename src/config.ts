import { findUp } from 'find-up'
import deepmerge from 'deepmerge'
import _debug from 'debug'
import jiti from 'jiti'
import type { Configuration, UserConfiguration } from './types'
import { CONFIG_FILES, DEFAULT_CONFIG } from './const'

const debug = _debug('fresko:config')

export const declareConfiguration = (config: UserConfiguration): UserConfiguration => {
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

export async function resolveConfig(): Promise<Configuration> {
  const match = await findUp(CONFIG_FILES, { cwd: process.cwd() })

  if (!match)
    return DEFAULT_CONFIG

  debug(`config file found ${match}`)
  const config = tryRequire(match)

  return deepmerge(DEFAULT_CONFIG, config) as Configuration
}
