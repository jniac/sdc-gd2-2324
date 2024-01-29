import fs from 'fs/promises'
import path from 'path'
import { data } from '../data.mjs'

const capitalize = str => str[0].toUpperCase() + str.slice(1).toLowerCase()

async function filesExists(filepath) {
  try {
    await fs.access(filepath)
    return true
  } catch (error) {
    return false
  }
} 

const students = data.promotion
  .filter(student => student.github !== 'IAmSoDIM') // already done

const srcDir = `artefact/template/`
const files = [...await fs.readdir(srcDir)]
  .map(file => path.join(srcDir, file))

const entries = await Promise.all(files.map(async file => {
  const str = await fs.readFile(file, { encoding: 'utf-8' })
  return { file, str }
}))

for (const student of students) {
  const dstDir = `../../art/${student.github}/artefact/`
  for (const { file, str } of entries) {
    await fs.mkdir(dstDir, { recursive: true })
    const dst = path.join(dstDir, path.basename(file))
    const modifiedStr = str
      .replaceAll(/\$GITHUB/g, student.github)
      .replaceAll(/\$NAMES/g, student.names.map(capitalize).join(' '))
    
    if (await filesExists(dst)) {
      console.log(`skipping ${dst} (already exists)`)
      continue      
    }
    
    fs.writeFile(dst, modifiedStr)
  }
}