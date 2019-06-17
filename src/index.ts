export interface Options {
  prefix: string
}

export interface Alias {
  sourceName: string
  destName: string
}

export interface AliasWithValue extends Alias {
  value: string | undefined
}

const defaultOptions: Options = {
  prefix: 'ENV_ALIAS_'
}

// --

export const extractAliasingDeclarations = (
  env: NodeJS.ProcessEnv,
  options: Options
): Alias[] => {
  return Object.keys(env)
    .filter(key => key.startsWith(options.prefix) && !!env[key])
    .map(key => {
      const sourceName = env[key]!
      const destName = key.slice(options.prefix.length, key.length)
      return { sourceName, destName }
    })
}

export const injectAlias = (env: NodeJS.ProcessEnv, alias: Alias) => {
  env[alias.destName] = env[alias.sourceName]
}

export const createRunner = (env: NodeJS.ProcessEnv) => (
  options: Options = defaultOptions
): AliasWithValue[] => {
  const aliases = extractAliasingDeclarations(env, options)
  aliases.forEach(alias => injectAlias(env, alias))
  return aliases.map(alias => ({
    ...alias,
    value: env[alias.destName]
  }))
}

export default createRunner(process.env)
