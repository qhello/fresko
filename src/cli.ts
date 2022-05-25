#!/usr/bin/env node
import _debug from 'debug'
import { resolveConfig } from './config'
import { confirmCommand, filterPrompts, printCommands, printHeader, runCommand } from './utils'
const debug = _debug('fresko:cli')

const run = async () => {
  // Load configuration
  const config = await resolveConfig()

  debug('config', JSON.stringify(config, null, 2))

  const updatedPaths = (await runCommand('git diff --name-only "HEAD@{1}" HEAD', { silent: true })).trim().split('\n')

  debug('updatedPaths', JSON.stringify(updatedPaths, null, 2))

  // Check which prompts should be run
  const prompts = filterPrompts(updatedPaths, config.prompts)

  debug('filteredPrompts', JSON.stringify({ prompts }, null, 2))

  // If there are no prompts to run, exit
  if (!prompts.length)
    return

  // Welcome message
  printHeader(config.theme.start)

  console.warn(`commands queued for execution: ${printCommands(prompts)}\n`)

  // Run prompts
  await confirmCommand(prompts, config)

  printHeader(config.theme.end)
}

run()
