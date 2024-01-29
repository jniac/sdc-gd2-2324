import fs from 'fs/promises'
import yaml from 'js-yaml'

/**
 * @typedef {object} Student
 * @property {string[]} names
 * @property {string} github
 * @property {string} prefix
 */

/** @type {{ promotion: Student[] }} */
export const data = await fs.readFile('../promotion.yaml', { encoding: 'utf-8' })
  .then(text => yaml.load(text))

