#!/usr/bin/env node

import shell from 'shelljs'
import _debug from 'debug'
import { resolveConfig } from './config'
import type { Configuration } from './types'
import { confirmCommand, filterPrompts, printHeader, printSubheader } from './utils'

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

  const updatedPaths = shell.exec('git diff --name-only "HEAD@{1}" HEAD', { silent: true }).toString().trim().split('\n')

  debug('updatedPaths', JSON.stringify(updatedPaths, null, 2))

  // Check which prompts should be run
  const prompts = filterPrompts(updatedPaths, config.prompts)

  // If there are no prompts to run, exit
  if (prompts.length === 0)
    return

  // Welcome message
  printHeader(config.theme.start.header)
  printSubheader(config.theme.start.subheader)

  // Run prompts
  for (const prompt of prompts)
    await confirmCommand(prompt)

  printHeader(config.theme.end.header)
  printSubheader(config.theme.end.subheader)
}

run()
