export declare type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U> ? Array<DeepPartial<U>> : T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : DeepPartial<T[P]> | T[P];
}

export interface PromptConfiguration {
  path: string | string[]
  command: string
}

export interface Configuration {
  prompts: PromptConfiguration[]
  theme: {
    start: {
      header: string
      subheader: string
    }
    end: {
      header: string
      subheader: string
    }
  }
}

export type UserConfiguration = {
  prompts: Configuration['prompts']
} & DeepPartial<Configuration>
