import yaml from 'js-yaml'
import fs from 'fs/promises'

const data = await fs.readFile('info/promotion.yaml', { encoding: 'utf-8' })
  .then(text => yaml.load(text))

async function filesExists(folder) {
  try {
    await Promise.all(data.promotion.map(student => fs.lstat(`art/${student.github}`)))
  } catch (err) {
    return `"${err.path}" is missing`
  }
  return 'ok'
}

console.log(`web folders: ${await filesExists()}`)
