import type { PromptConfiguration } from '../types'

export const filterPrompts = (updatedPaths: string[], prompts: PromptConfiguration[]): PromptConfiguration[] => {
  const filteredPrompts = prompts.filter(({ path }) => {
    const paths = Array.isArray(path) ? path : [path]
    return paths.some(p => updatedPaths.some(u => u.includes(p)))
  })
  return filteredPrompts
}
