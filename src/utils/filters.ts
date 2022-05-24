import type { PromptConfiguration } from '../types'

export const filterPrompts = (updatedPaths: string[], prompts: PromptConfiguration[]): PromptConfiguration[] => {
  const affectedPrompts: Array<PromptConfiguration> = []

  prompts.forEach((prompt) => {
    const paths = Array.isArray(prompt.path) ? prompt.path : [prompt.path]
    const filteredPaths = paths.filter(p => updatedPaths.some(u => u.includes(p)))

    if (!filteredPaths)
      return

    affectedPrompts.push({ ...prompt, path: filteredPaths })
  })

  return affectedPrompts
}
