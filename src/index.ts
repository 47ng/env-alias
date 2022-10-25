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

/**
 * @internal Exported for tests only
 */
export const _extractAliasingDeclarations = (
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

/**
 * @internal Exported for tests only
 */
export const _injectAlias = (env: NodeJS.ProcessEnv, alias: Alias) => {
  if (env[alias.destName] !== undefined) {
    return // don't overwrite existing destination variables
  }
  env[alias.destName] = env[alias.sourceName]
}

/**
 * @internal Exported for tests only
 */
export const _createEnvAliaser =
  (env: NodeJS.ProcessEnv) =>
  (options: Options = defaultOptions): Alias[] => {
    const aliases = _extractAliasingDeclarations(env, options)
    aliases.forEach(alias => _injectAlias(env, alias))
    return aliases
  }

export const envAlias = _createEnvAliaser(process.env)
