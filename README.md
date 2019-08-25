wm-cli
======

Awesome Tooling for JS Development

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/wm-cli.svg)](https://npmjs.org/package/wm-cli)
[![CircleCI](https://circleci.com/gh/wmadfaa/wm-cli/tree/master.svg?style=shield)](https://circleci.com/gh/wmadfaa/wm-cli/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/wm-cli.svg)](https://npmjs.org/package/wm-cli)
[![License](https://img.shields.io/npm/l/wm-cli.svg)](https://github.com/wmadfaa/wm-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g wm-cli
$ wm-cli COMMAND
running command...
$ wm-cli (-v|--version|version)
wm-cli/0.0.1 darwin-x64 node-v12.8.0
$ wm-cli --help [COMMAND]
USAGE
  $ wm-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`wm-cli hello [FILE]`](#wm-cli-hello-file)
* [`wm-cli help [COMMAND]`](#wm-cli-help-command)

## `wm-cli hello [FILE]`

describe the command here

```
USAGE
  $ wm-cli hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ wm-cli hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/wmadfaa/wm-cli/blob/v0.0.1/src/commands/hello.ts)_

## `wm-cli help [COMMAND]`

display help for wm-cli

```
USAGE
  $ wm-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_
<!-- commandsstop -->
