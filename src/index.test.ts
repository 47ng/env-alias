import * as envAlias from './index'

describe('extractAliasingDeclarations', () => {
  test('no aliases', () => {
    const env = {}
    const options = { prefix: '' }
    const received = envAlias.extractAliasingDeclarations(env, options)
    expect(received).toEqual([])
  })
  test('find aliases', () => {
    const env = {
      PREFIX_DEST_FOO: 'SOURCE_FOO',
      PREFIX_DEST_BAR: 'SOURCE_BAR'
    }
    const options = { prefix: 'PREFIX_' }
    const received = envAlias.extractAliasingDeclarations(env, options)
    expect(received).toEqual([
      { sourceName: 'SOURCE_FOO', destName: 'DEST_FOO' },
      { sourceName: 'SOURCE_BAR', destName: 'DEST_BAR' }
    ])
  })
  test('undefined alias value should be ignored', () => {
    const env = {
      PREFIX_DEST_FOO: undefined
    }
    const options: envAlias.Options = { prefix: 'PREFIX_' }
    const received = envAlias.extractAliasingDeclarations(env, options)
    expect(received).toEqual([])
  })
})

describe('injectAlias', () => {
  test('it goes in the right direction', () => {
    const env = {
      SOURCE_FOO: 'foo'
    }
    const alias: envAlias.Alias = {
      sourceName: 'SOURCE_FOO',
      destName: 'DEST_FOO'
    }
    envAlias.injectAlias(env, alias)
    expect(env).toHaveProperty('DEST_FOO', 'foo')
  })
})

describe('createRunner', () => {
  test('default configuration', () => {
    const env = {
      SOURCE: 'value',
      ENV_ALIAS_DEST: 'SOURCE'
    }
    const run = envAlias.createRunner(env)
    const received = run()
    expect(received).toEqual([
      { destName: 'DEST', sourceName: 'SOURCE', value: 'value' }
    ])
  })
  test('custom prefix', () => {
    const env = {
      SOURCE: 'value',
      PREFIX_DEST: 'SOURCE'
    }
    const run = envAlias.createRunner(env)
    const received = run({ prefix: 'PREFIX_' })
    expect(received).toEqual([
      { destName: 'DEST', sourceName: 'SOURCE', value: 'value' }
    ])
  })
  test('undefined source has undefined value', () => {
    const env = {
      SOURCE: undefined,
      PREFIX_DEST: 'SOURCE'
    }
    const run = envAlias.createRunner(env)
    const received = run({ prefix: 'PREFIX_' })
    expect(received[0].value).toBeUndefined()
  })
  test('missing source has undefined value', () => {
    const env = {
      PREFIX_DEST: 'SOURCE'
    }
    const run = envAlias.createRunner(env)
    const received = run({ prefix: 'PREFIX_' })
    expect(received[0].value).toBeUndefined()
  })
})
