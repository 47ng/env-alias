import {
  Alias,
  Options,
  _createEnvAliaser,
  _extractAliasingDeclarations,
  _injectAlias
} from './index'

describe('_extractAliasingDeclarations', () => {
  test('no aliases', () => {
    const env = {}
    const options = { prefix: '' }
    const received = _extractAliasingDeclarations(env, options)
    expect(received).toEqual([])
  })
  test('find aliases', () => {
    const env = {
      PREFIX_DEST_FOO: 'SOURCE_FOO',
      PREFIX_DEST_BAR: 'SOURCE_BAR'
    }
    const options = { prefix: 'PREFIX_' }
    const received = _extractAliasingDeclarations(env, options)
    expect(received).toEqual([
      { sourceName: 'SOURCE_FOO', destName: 'DEST_FOO' },
      { sourceName: 'SOURCE_BAR', destName: 'DEST_BAR' }
    ])
  })
  test('undefined alias value should be ignored', () => {
    const env = {
      PREFIX_DEST_FOO: undefined
    }
    const options: Options = { prefix: 'PREFIX_' }
    const received = _extractAliasingDeclarations(env, options)
    expect(received).toEqual([])
  })
})

describe('_injectAlias', () => {
  test('it goes in the right direction', () => {
    const env = {
      SOURCE_FOO: 'foo'
    }
    const alias: Alias = {
      sourceName: 'SOURCE_FOO',
      destName: 'DEST_FOO'
    }
    _injectAlias(env, alias)
    expect(env).toHaveProperty('DEST_FOO', 'foo')
  })
  test('it does not override an existing destination variable', () => {
    const env = {
      SOURCE_FOO: 'foo',
      DEST_FOO: 'will-not-be-erased'
    }
    const alias: Alias = {
      sourceName: 'SOURCE_FOO',
      destName: 'DEST_FOO'
    }
    _injectAlias(env, alias)
    expect(env.DEST_FOO).toEqual('will-not-be-erased')
  })
})

describe('_createEnvAliaser', () => {
  test('default configuration', () => {
    const env = {
      SOURCE: 'value',
      ENV_ALIAS_DEST: 'SOURCE'
    }
    const run = _createEnvAliaser(env)
    const received = run()
    expect(received).toEqual([{ destName: 'DEST', sourceName: 'SOURCE' }])
    expect(env).toHaveProperty('DEST', 'value')
  })
  test('custom prefix', () => {
    const env = {
      SOURCE: 'value',
      PREFIX_DEST: 'SOURCE'
    }
    const run = _createEnvAliaser(env)
    const received = run({ prefix: 'PREFIX_' })
    expect(received).toEqual([{ destName: 'DEST', sourceName: 'SOURCE' }])
    expect(env).toHaveProperty('DEST', 'value')
  })
  test('undefined source has undefined value', () => {
    const env = {
      SOURCE: undefined,
      PREFIX_DEST: 'SOURCE'
    }
    const run = _createEnvAliaser(env)
    const received = run({ prefix: 'PREFIX_' })
    expect(received).toEqual([{ destName: 'DEST', sourceName: 'SOURCE' }])
    expect(env).toHaveProperty('DEST', undefined)
  })
  test('missing source has undefined value', () => {
    const env = {
      PREFIX_DEST: 'SOURCE'
    }
    const run = _createEnvAliaser(env)
    const received = run({ prefix: 'PREFIX_' })
    expect(received).toEqual([{ destName: 'DEST', sourceName: 'SOURCE' }])
    expect(env).toHaveProperty('DEST', undefined)
  })
})
