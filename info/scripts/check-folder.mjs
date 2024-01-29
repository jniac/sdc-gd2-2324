import fs from 'fs/promises'
import chalk from 'chalk'
import { data } from './data.mjs'

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

const unrealArtFolder = '/Users/joseph/Documents/Unreal Projects/SDC_GD2_2324_UE5_V2/Content/Art'
console.log(`unreal folders: ${await filesExists(unrealArtFolder, ({ prefix, github }) => `${prefix}_${github}`)}`)
