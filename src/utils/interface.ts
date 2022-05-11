import _debug from 'debug'
import chalk from 'chalk'
import figlet from 'figlet'
import inquirer from 'inquirer'
import type { PromptConfiguration } from '../types'
import { runCommand as exec } from './commands'

const debug = _debug('fresko:interface')

export const printHeader = (text: string) => {
  console.warn(chalk.green(figlet.textSync(text, 'Doom')))
}

export const printSubheader = (text: string) => {
  console.warn(chalk.italic(`${text}\n`))
}

export const confirmCommand = async ({
  path,
  command,
  ...options
}: PromptConfiguration) => {
  debug('confirmCommand', { path, command, options })
  console.warn(`\n 📦 ${chalk.white.bgGrey(path)} was updated! \n`)

  const questions = [
    {
      name: 'runCommand',
      type: 'confirm',
      message: `would you like to run ${chalk.white.bgGrey(command)}?`,
      default: true,
    },
  ]

  const { runCommand } = await inquirer.prompt<{ runCommand: boolean }>(
    questions,
  )

  if (runCommand)
    await exec(command, options)
}
