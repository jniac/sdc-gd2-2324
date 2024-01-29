import fs from 'fs/promises'
import { data } from '../data.mjs'

const students = data.promotion
  .filter(student => student.github !== 'IAmSoDIM') // already done

for (const student of students) {
  const dst = `../../art/${student.github}/artefact`
  fs.cp(`artefact`, dst, { recursive: true })
}