#!/usr/bin/env node
/* eslint-disable no-console */

import chalk from 'chalk'
import figlet from 'figlet'
import inquirer from 'inquirer'
import shell from 'shelljs'

const CONFIG = {
  start: {
    header: 'Fresko',
    subheader: 'helping you keeping your workspace fresh since 1337.',
  },
  end: {
    header: 'Frescatu!',
    subheader: 'And they lived happily ever after.',
  },
  steps: [
    {
      path: 'yarn.lock',
      icon: '📦',
      command: 'yarn',
    },
    {
      path: ['backend/libraries/entities/src/migration', 'backend/libraries/entities/src/fixtures'],
      icon: '📦',
      command: 'yarn workspace @sline/app package',
    },
  ],
}

const printBigMessage = (text: string) => {
  console.log(chalk.green(figlet.textSync(text)))
}

const printSmallMessage = (text: string) => {
  console.log(chalk.italic(`${text}\n`))
}

const confirmCommand = async ({
  flags,
  infoMessage,
  questionMessage,
  command,
}: {
  flags: string[]
  infoMessage: string
  questionMessage: string
  command: string
}) => {
  const isAnyFlagPresent = flags.some(flag => process.argv.includes(flag))

  if (!isAnyFlagPresent)
    return

  console.log(`\n ${infoMessage} \n`)

  const questions = [
    {
      name: 'runCommand',
      type: 'confirm',
      message: questionMessage,
      default: true,
    },
  ]

  const { runCommand } = await inquirer.prompt<{ runCommand: boolean }>(
    questions,
  )

  if (runCommand)
    shell.exec(command)
}

const run = async () => {
  // Welcome message
  printBigMessage(CONFIG.start.header)
  printSmallMessage(CONFIG.start.subheader)

  // Yarn.lock was updated
  await confirmCommand({
    flags: ['--yarnLock'],
    infoMessage: `📦 ${chalk.white.bgGrey('yarn.lock')} was updated!`,
    questionMessage: `would you like to run ${chalk.white.bgGrey('yarn')}?`,
    command: 'yarn',
  })

  // Migrations or Fixtures changed
  await confirmCommand({
    flags: ['--migrations', '--fixtures'],
    infoMessage: `📂 ${chalk.white.bgGrey(
      'backend/libraries/entities/src/[migration|fixtures]',
    )} was updated!`,
    questionMessage: `would you like to run ${chalk.white.bgGrey(
      'yarn package',
    )}?`,
    command: 'yarn workspace @sline/app package',
  })

  // Migrations changed
  await confirmCommand({
    flags: ['--migrations'],
    infoMessage: `📂 ${chalk.white.bgGrey(
      'backend/libraries/entities/src/migration',
    )} was updated!`,
    questionMessage: `would you like to run ${chalk.white.bgGrey(
      'yarn workspace @sline/backend-entities migrate:local',
    )}?`,
    command: 'yarn workspace @sline/backend-entities migrate:local',
  })

  // Fixtures changed
  await confirmCommand({
    flags: ['--fixtures'],
    infoMessage: `📂 ${chalk.white.bgGrey(
      'backend/libraries/entities/src/fixtures',
    )} was updated!`,
    questionMessage: `would you like to run ${chalk.white.bgGrey(
      'yarn workspace @sline/backend-entities loadFixtures',
    )}?`,
    command: 'yarn workspace @sline/backend-entities loadFixtures',
  })

  printBigMessage(CONFIG.end.header)
  printSmallMessage(CONFIG.end.subheader)
}

run()
