export interface Options {
  prefix: string
}

export interface Alias {
  sourceName: string
  destName: string
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
  if (env[alias.destName] !== undefined) {
    return // don't overwrite existing destination variables
  }
  env[alias.destName] = env[alias.sourceName]
}

export const createRunner = (env: NodeJS.ProcessEnv) => (
  options: Options = defaultOptions
): Alias[] => {
  const aliases = extractAliasingDeclarations(env, options)
  aliases.forEach(alias => injectAlias(env, alias))
  return aliases
}

export default createRunner(process.env)
