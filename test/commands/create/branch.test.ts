import {expect, test} from '@oclif/test'

describe('create:branch', () => {
  test
    .stdout()
    .command(['create:branch'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['create:branch', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
