import fs from 'fs-extra'
import path from 'path'
import yaml from 'js-yaml'
import chalk from 'chalk'

/**
 * @typedef {object} Student
 * @property {string[]} names
 * @property {string} github
 * @property {string} prefix
 */

/** @type {{ promotion: Student[] }} */
const data = await fs.readFile('promotion.yaml', { encoding: 'utf-8' })
  .then(text => yaml.load(text))

/**
 * 
 * @param {string} folder 
 * @param {(student: Student) => string} fileNamePredicate 
 * @returns 
 */
async function createFolders(folder, fileNamePredicate = student => student.github) {
  for (const student of data.promotion) {
    const readme = path.join(folder, `${student.prefix}_${student.github}/README.md`)
    console.log(readme)
    if (await fs.exists(readme) === false) {
      console.log(`creating ${readme}`)
      await fs.createFile(readme)
      await fs.writeFile(readme, `
# ${student.prefix}_${student.github}

Dossier de travail de ${student.names.join(' ')}
      `)
    }
  }
}

const unrealArtFolder = '/Users/joseph/Documents/Unreal Projects/SDC_GD2_2324_UE5_LSP/Content/Art'
console.log(`unreal folders: ${await createFolders(unrealArtFolder, ({ prefix, github }) => `${prefix}_${github}`)}`)
