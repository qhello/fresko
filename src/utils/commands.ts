import { spawn } from 'child_process'
import chalk from 'chalk'
import _debug from 'debug'
import type { PromptOptions } from '../types'

const debug = _debug('fresko:cli')

const addPrefix = (
  out: string,
  prefix = '>>>',
) => {
  out = out
    .toString()
    .split('\n')
    .map(l =>
      l.trim().length > 0 ? `${chalk.bold(prefix)} ${l}` : l,
    )
    .join('\n')

  return out
}

const defaultOptions: PromptOptions = {
  silent: false,
  env: {},
}

export const runCommand = (command: string, options: Partial<PromptOptions>): Promise<string> => {
  return new Promise((resolve, reject) => {
    const opts: PromptOptions = { ...defaultOptions, ...options }
    const args = command.split(' ')
    const commandName = args.shift()

    debug({ commandName, args, opts })

    const childProcess = spawn(commandName as string, args, {
      shell: true,
      stdio: 'pipe',
      env: { ...process.env, ...opts.env }, // required to pass process.env
    })

    if (childProcess.stderr === null || childProcess.stdout === null) {
      reject(new Error('Failed to spawn child process'))
      return
    }

    let result = ''

    childProcess.stdout.on('data', (data) => {
      result += data
      if (!opts.silent)
        process.stdout.write(addPrefix(data))
    })
    childProcess.stderr.on('data', (err) => {
      process.stderr.write(addPrefix(err))
    })
    childProcess.on('exit', () => {
      resolve(result)
    })
  })
}

