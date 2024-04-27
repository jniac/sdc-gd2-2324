import fs from 'fs/promises'
import yaml from 'js-yaml'

async function exists(file) {
  try {
    await fs.access(file)
    return true
  } catch (error) {
    return false
  }
}

/**
 * @typedef {object} Student
 * @property {string[]} names
 * @property {string} github
 * @property {string} prefix
 */

/** @type {{ promotion: Student[] }} */
const data = await fs.readFile('promotion.yaml', { encoding: 'utf-8' })
  .then(text => yaml.load(text))

const indexHtml = await fs.readFile('../art/jniac/contribution-davinci/index.html', 'utf-8')


for (const file of await fs.readdir('../art')) {
  const student = data.promotion.find(student => student.github === file)

  if (!student) {
    continue
  }

  if (await exists(`art/${file}/contribution-davinci`)) {
    console.log(`art/${file}/contribution-davinci already exists`)
    continue
  }

  await fs.cp('../art/jniac/contribution-davinci', `../art/${file}/contribution-davinci`, { recursive: true })
  const studentIndexHtml = indexHtml.replace(
    '<h1>Joseph Merdrignac (<a href="https://github.com/jniac">jniac</a>)</h1>',
    `<h1>${student.names.join(' ')} (<a href="https://github.com/${file}">${file}</a>)</h1>`)
  await fs.writeFile(`../art/${file}/contribution-davinci/index.html`, studentIndexHtml)
  console.log(`copied to ../art/${file}/contribution-davinci`)
}
