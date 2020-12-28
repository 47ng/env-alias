# ♊ `env-alias`

[![NPM](https://img.shields.io/npm/v/env-alias?color=red)](https://www.npmjs.com/package/env-alias)
[![MIT License](https://img.shields.io/github/license/47ng/env-alias.svg?color=blue)](https://github.com/47ng/env-alias/blob/master/LICENSE)
[![Continuous Integration](https://github.com/47ng/env-alias/workflows/Continuous%20Integration/badge.svg?branch=next)](https://github.com/47ng/env-alias/actions)
[![Coverage Status](https://coveralls.io/repos/github/47ng/env-alias/badge.svg?branch=next)](https://coveralls.io/github/47ng/env-alias?branch=next)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=47ng/env-alias)](https://dependabot.com)

Define aliases for environment variables and bind them at runtime.

## Rationale

Platform providers may have different names for related environment
variables, and often developers rely on a particular name to be available,
tying the code to the targeted deployment platform. This leads to lock-in,
and makes it harder to deploy the application anywhere, breaking the
first rule of the [Twelve Factor App](https://12factor.net/codebase):
one codebase, many deploys.

Environment variable aliasing helps with breaking this lock-in, as it is
done not in the code, but in the environment itself:

```shell
# Assign DEST_BAR to the value of SOURCE_FOO at runtime
ENV_ALIAS_DEST_BAR='SOURCE_FOO'
```

## Installation

```shell
$ yarn add env-alias
# or
$ npm i env-alias
```

## Usage

Your environment could look like this:

```zsh
# These are set by your hosting provider:
PROVIDER_GIT_COMMIT_ID
PROVIDER_DEPLOYMENT_ID

# But your app expects these:
MY_GIT_SHA1
MY_DEPLOYMENT_ID

# Declare aliased variables:
ENV_ALIAS_MY_GIT_SHA1='PROVIDER_GIT_COMMIT_ID'
ENV_ALIAS_MY_DEPLOYMENT_ID='PROVIDER_DEPLOYMENT_ID'
```

Then in your code:

```ts
import envAlias from 'env-alias'

envAlias({
  aliasPrefix: 'ENV_ALIAS_' // default prefix
})

const gitSha1 = process.env.MY_GIT_SHA1
const deployment = process.env.MY_DEPLOYMENT_ID
```

## Configuration

`env-alias` accepts an optional configuration object with the following
properties:

- `aliasPrefix`: a string that will define the prefix to look for when
  resolving aliases. Defaults to `ENV_ALIAS_`.

  Anything after this prefix will become the aliased variable name
  (so don't forget the underscore).

## List of aliases

`envAlias` will return the list of aliases it has found and processed:

```ts
import envAlias from 'env-alias'

const aliases = envAlias()
console.log(aliases)
```

```json
[
  {
    "sourceName": "PROVIDER_GIT_COMMIT_ID",
    "destName": "MY_GIT_SHA1"
  },
  {
    "sourceName": "PROVIDER_DEPLOYMENT_ID",
    "destName": "MY_DEPLOYMENT_ID"
  }
]
```

## Order of precedence

If a variable with the destination name is set, `env-alias` will not
overwrite it. This allows overriding aliased definitions by explicitly
setting the target variable:

```zsh
APP_NAME="foo"

MY_APP_NAME="bar"

ENV_ALIAS_MY_APP_NAME="APP_NAME"

# MY_APP_NAME will be "bar"
```

## License

[MIT](https://github.com/47ng/env-alias/blob/master/LICENSE) - Made with ❤️ by [François Best](https://francoisbest.com)

Using this package at work ? [Sponsor me](https://github.com/sponsors/franky47) to help with support and maintenance.
