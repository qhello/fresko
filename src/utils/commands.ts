import { spawn } from 'child_process'
import chalk from 'chalk'
import _debug from 'debug'

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

export const runCommand = (
  command: string,
  { silent }: { silent: boolean } = { silent: false },
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const args = command.split(' ')
    const commandName = args.shift()

    debug({ commandName, args })

    const childProcess = spawn(commandName as string, args, {
      shell: true,
      stdio: 'pipe',
    })

    if (childProcess.stderr === null || childProcess.stdout === null) {
      reject(new Error('Failed to spawn child process'))
      return
    }

    let result = ''

    childProcess.stdout.on('data', (data) => {
      result += data
      if (!silent)
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

