#!/usr/bin/env node
import _debug from 'debug'
import { resolveConfig } from './config'
import type { Configuration } from './types'
import { confirmCommand, filterPrompts, printHeader, printSubheader, runCommand } from './utils'
const debug = _debug('fresko:cli')

const defaultConfiguration: Configuration = {
  theme: {
    start: {
      header: 'Fresko',
      subheader: 'helping you keeping your workspace fresh since 1337.',
    },
    end: {
      header: 'Done!',
      subheader: 'And they lived happily ever after.',
    },
  },
  prompts: [],
}

const run = async () => {
  // Load configuration
  const config = await resolveConfig(defaultConfiguration)

  debug('config', JSON.stringify(config, null, 2))

  const updatedPaths = (await runCommand('git diff --name-only "HEAD@{1}" HEAD', { silent: true })).trim().split('\n')

  debug('updatedPaths', JSON.stringify(updatedPaths, null, 2))

  // Check which prompts should be run
  const filteredPrompts = filterPrompts(updatedPaths, config.prompts)

  debug('filteredPrompts', JSON.stringify(filteredPrompts, null, 2))

  // If there are no prompts to run, exit
  if (filteredPrompts.length === 0)
    return

  // Welcome message
  printHeader(config.theme.start.header)
  printSubheader(config.theme.start.subheader)

  // Run prompts
  for (const prompt of filteredPrompts)
    await confirmCommand(prompt)

  printHeader(config.theme.end.header)
  printSubheader(config.theme.end.subheader)
}

run()
