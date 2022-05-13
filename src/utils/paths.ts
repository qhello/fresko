import { runCommand } from './commands'

export const getUpdatedPaths = async (): Promise<string[]> => {
  const updatedPaths = await runCommand('git diff --name-only "HEAD@{1}" HEAD', { silent: true })
  return updatedPaths.trim().split('\n')
}
