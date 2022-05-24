import _debug from 'debug'
import chalk from 'chalk'
import Prompts from 'prompts'
import deepmerge from 'deepmerge'
import type { Configuration, PromptConfiguration } from '../types'
import { runCommand as exec } from './commands'

const debug = _debug('fresko:interface')

export const printHeader = ({ header, subheader }: { header: string; subheader: string }) => {
  if (!header && !subheader)
    return

  console.warn(`\n${chalk.green(header)}\n${chalk.gray(subheader)}\n`)
}

export const printCommands = (prompts: PromptConfiguration[]): string => {
  const lines = prompts.map(p => `  "${chalk.cyan(p.command)}", ${chalk.italic.green(`// modified path: ${p.path}`)}`).join('\n')
  return `[\n${lines}\n]`
}

export const confirmCommand = async (prompts: PromptConfiguration[], config: Configuration) => {
  const { runCommands } = await Prompts({
    type: 'select',
    name: 'runCommands',
    message: 'which commands would you like to run?',
    choices: [
      { title: 'all', description: 'run all commands sequentially', value: 'all' },
      { title: 'some', value: 'some', disabled: true },
      { title: 'none', value: 'none' },
    ],
  })

  debug({ runCommands })

  if (!runCommands || runCommands === 'none')
    return

  for (const { command, silent, env } of prompts) {
    const options = deepmerge({ silent, env }, config.default)

    console.warn(`running command: ${chalk.cyan(command)}`)

    await exec(command, options)
  }
}
