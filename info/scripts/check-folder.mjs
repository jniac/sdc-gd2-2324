import fs from 'fs/promises'
import yaml from 'js-yaml'
import chalk from 'chalk'

/**
 * @typedef {object} Student
 * @property {string[]} names
 * @property {string} github
 * @property {string} prefix
 */

/** @type {{ promotion: Student[] }} */
const data = await fs.readFile('../promotion.yaml', { encoding: 'utf-8' })
  .then(text => yaml.load(text))

/**
 * 
 * @param {string} folder 
 * @param {(student: Student) => string} fileNamePredicate 
 * @returns 
 */
async function filesExists(folder, fileNamePredicate = student => student.github) {
  try {
    const files = (await fs.readdir(folder)).filter(file => file.startsWith('.') === false)
    const studentFiles = data.promotion.map(student => fileNamePredicate(student))
    const missingFiles = studentFiles.filter(studentFile => files.includes(studentFile) === false)
    const extraFiles = files.filter(file => studentFiles.includes(file) === false)

    const extraFilesInfo = chalk.dim(extraFiles.length > 0 ? `(extras files: ${extraFiles.join(', ')})` : '(no extra files)')
    if (missingFiles.length > 0) {
      return `${chalk.red('missing files!')} ${missingFiles.join(', ')} ${extraFilesInfo}`
    } else {
      return `${chalk.greenBright('ok')} ${extraFilesInfo}`
    }
  } catch (error) {
    return `Invalid folder!` 
  }
}

const webArtFolder = '../../art'
console.log(`web folders: ${await filesExists(webArtFolder)}`)

const unrealArtFolder = '/Users/joseph/Documents/Unreal Projects/SDC_GD2_2324_UE5/Content/Art'
console.log(`unreal folders: ${await filesExists(unrealArtFolder, ({ prefix, github }) => `${prefix}_${github}`)}`)
