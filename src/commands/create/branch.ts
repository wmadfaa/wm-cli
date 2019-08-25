import {Command, flags} from '@oclif/command'
import * as inquirer from 'inquirer'
import * as Listr from 'listr'
import * as simplegit from 'simple-git/promise'

const git = simplegit()
const prompt = inquirer.createPromptModule()

const ILLEGAL_CHARACTERS = new RegExp(/[`~!@#$%§^&*()_|+\-=÷¿?;:'",.<>\{\}\[\]\\\/\s]/, 'gi')
const HYPHENS = new RegExp(/\--*/, 'gi')
const BRANCH_NAME = new RegExp(/^(feature|bugfix|improvement|library|prerelease|release|hotfix)(\/[a-z0-9._-]+)?(\/[a-z0-9._-]+)$/, 'gi')

interface Options {
  id?: string
  remote: boolean
  root: string
  type: string
  desc: string
}

export default class CreateBranch extends Command {
  static description = 'create remote/local git branch'

  static flags = {
    help: flags.help({char: 'h'}),
    remote: flags.boolean({description: 'track the created branch'}), // default: false,
    root: flags.string({description: 'root branch name'}), // default: 'master',
    type: flags.string({
      char: 't',
      description: 'Branch type',
      options: [
        'feature',
        'bugfix',
        'improvement',
        'library',
        'prerelease',
        'release',
        'hotfix'
      ],
    }), // default: 'feature'
    id: flags.string({char: 'i', description: 'Jira ticket Id'}),
    desc: flags.string({char: 'd', description: 'Jira ticket description'})
  }

  branchName!: string
  formatedDesc!: string

  format_description = (desc: string) => desc.replace(ILLEGAL_CHARACTERS, '-').replace(HYPHENS, '-')

  validate_branch_name = (branchName: string) => BRANCH_NAME.test(branchName)

  get_validate_branchName_task = (desc: string, type: string, id?: string) => new Listr([
    {
      title: 'format branch description',
      task: () => {
        try {
          this.formatedDesc = this.format_description(desc)
          return
        } catch (error) {
          throw new Error(error)
        }
      }
    },
    {
      title: 'create branch name',
      task: () => {
        this.branchName = `${type}/${id ? `${id}/` : ''}${this.format_description(desc)}`
      }
    },
    {
      title: 'validate branch name',
      task: () => {
        if (this.validate_branch_name(this.branchName)) {
          return
        }
        throw new Error(`branch name should match this format branchType/optional:branchId/branchDescription.
          your input value: ${this.branchName} ${this.format_description(desc)}
        `)
      }
    }
  ], {concurrent: true})

  get_create_origin_branch_task = (root: string, desc: string, type: string, id?: string) => new Listr([
    {
      title: 'validate inputs',
      task: () => this.get_validate_branchName_task(desc, type, id)
    },
    {
      title: 'check repo',
      task: async () => {
        try {
          return await git.checkIsRepo()
        } catch (error) {
          throw new Error(error)
        }
      }
    },
    {
      title: 'create new branch in origin',
      task: async () => {
        try {
          return await git.push('origin', `${root}:refs/heads/${this.branchName}`)
        } catch (error) {
          throw new Error(error)
        }
      }
    },
    {
      title: 'fetch origin',
      task: async () => {
        try {
          return await git.fetch('origin')
        } catch (error) {
          throw new Error(error)
        }
      }
    },
    {
      title: 'switch to the new branch',
      task: () => new Listr([
        {
          title: 'track the branch',
          task: async () => {
            try {
              return await git.checkout(['--track', '-b', this.branchName, `origin/${this.branchName}`])
            } catch (error) {
              throw new Error(error)
            }
          }
        },
        {
          title: 'pull changes',
          task: async () => {
            try {
              return await git.pull()
            } catch (error) {
              throw new Error(error)
            }
          }
        }
      ], {concurrent: true})
    },
  ])

  get_create_local_branch_task = (root: string, desc: string, type: string, id?: string) => new Listr([
    {
      title: 'validate inputs',
      task: () => this.get_validate_branchName_task(desc, type, id)
    },
    {
      title: 'switch to root',
      task: async () => {
        try {
          await git.checkout(root)
        } catch (error) {
          throw new Error(error)
        }
      }
    },
    {
      title: 'create branch and switch to it',
      task: async () => {
        try {
          await git.checkout(['-b', this.branchName])
        } catch (error) {
          throw new Error(error)
        }
      }
    }
  ])

  prompt = async () => prompt<Options>([
    {
      name: 'type',
      message: CreateBranch.flags.type.description,
      type: 'list',
      choices: [
        {name: 'feature'},
        {name: 'bugfix'},
        {name: 'improvement'},
        {name: 'library'},
        {name: 'prerelease'},
        {name: 'release'},
        {name: 'hotfix'}
      ],
      default: 0
    },
    {
      name: 'id',
      message: CreateBranch.flags.id.description,
      type: 'input',
      default: '',
    },
    {
      name: 'desc',
      message: CreateBranch.flags.desc.description,
      type: 'input',
      validate: value => value !== ''
    },
    {
      name: 'remote',
      message: CreateBranch.flags.remote.description,
      type: 'confirm',
      default: false
    },
    {
      name: 'root',
      message: CreateBranch.flags.root.description,
      type: 'input',
      default: 'master'
    }
  ])

  async run() {
    const {flags} = this.parse(CreateBranch)
    let {desc, type, root, id, remote} = flags
    if (!(desc || type || root || id || remote)) {
      const answers = await this.prompt()
      desc = answers.desc
      type = answers.type
      root = answers.root
      id = answers.id
      remote = answers.remote
    }

    if (root && desc && type) {
      if (origin) {
        const createBranchTasks = this.get_create_origin_branch_task(root, desc, type, id)
        try {
          await createBranchTasks.run()
        } catch (error) {
          this.error(error)
        }
      } else {
        const createBranchTasks = this.get_create_local_branch_task(root, desc, type, id)
        try {
          await createBranchTasks.run()
        } catch (error) {
          this.error(error)
        }
      }
    }
  }
}
