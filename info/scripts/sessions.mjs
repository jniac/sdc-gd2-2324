import fs from 'fs-extra'
import yaml from 'js-yaml'

/** @type {{ sessions: { date: string }[] }} */
const data = await fs.readFile('sessions.yaml', { encoding: 'utf-8' })
  .then(text => yaml.load(text))

function hoursInfo() {
  const today = new Date()
  let total = 0
  let passed = 0
  for (const session of data.sessions) {
    const [dateStr, hStr] = session.date.split(/\s*-\s*/)
    const [dd, mm, yyyy] = dateStr.split(/\//)
    const date = new Date(Number.parseInt(yyyy), Number.parseInt(mm) - 1, Number.parseInt(dd))
    const h = Number.parseFloat(hStr)
    total += h
    if (date < today) {
      passed += h
    }
  }
  const sumup = `total: ${total}h, passed: ${passed}h (${(100 * passed / total).toFixed()}%)`
  return { total, passed, sumup }
}

console.log(hoursInfo().sumup)
