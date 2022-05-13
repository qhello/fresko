import _debug from 'debug'
import chalk from 'chalk'
import prompts from 'prompts'
import type { PromptConfiguration } from '../types'
import { runCommand as exec } from './commands'

const debug = _debug('fresko:interface')

export const printHeader = (text: string) => {
  if (!text)
    return
  console.warn(chalk.green(`\n${text}`))
}

export const printSubheader = (text: string) => {
  if (!text)
    return
  console.warn(chalk.italic(`${text}\n`))
}

export const confirmCommand = async ({
  path,
  command,
  ...options
}: PromptConfiguration) => {
  debug('confirmCommand', { path, command, options })
  console.warn(`\n 📦 ${chalk.white.bgGrey(path)} was updated! \n`)

  const { runCommand } = await prompts({
    type: 'confirm',
    name: 'runCommand',
    message: `would you like to run ${chalk.white.bgGrey(command)}?`,
    initial: true,
  })

  if (runCommand)
    await exec(command, options)
}
