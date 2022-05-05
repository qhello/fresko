/* eslint-disable no-console */
import chalk from 'chalk'
import figlet from 'figlet'
import inquirer from 'inquirer'
import shell from 'shelljs'
import type { PromptConfiguration } from './types'

export const printHeader = (text: string) => {
  console.log(chalk.green(figlet.textSync(text, 'Doom')))
}

export const printSubheader = (text: string) => {
  console.log(chalk.italic(`${text}\n`))
}

export const confirmCommand = async ({
  path,
  command,
}: PromptConfiguration) => {
  console.log(`\n 📦 ${chalk.white.bgGrey(path)} was updated! \n`)

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
    shell.exec(command)
}

export const filterPrompts = (updatedPaths: string[], prompts: PromptConfiguration[]): PromptConfiguration[] => {
  const filteredPrompts = prompts.filter(({ path }) => {
    const paths = Array.isArray(path) ? path : [path]
    return paths.some(p => updatedPaths.some(u => u.includes(p)))
  })
  return filteredPrompts
}
