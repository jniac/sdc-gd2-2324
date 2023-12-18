import yaml from 'https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.mjs'

const sessions = await window.fetch('../sessions.yaml')
  .then(response => response.text())
  .then(text => yaml.load(text))

const htmlText = (text, lineCount = 2) => text.replaceAll(/\n/g, '<br>'.repeat(lineCount))

Object.assign(window, { sessions })

document.querySelector('p.description').innerHTML = 
  htmlText(sessions.description)

for (const { title, content } of sessions.syllabus) {
  const div = document.createElement('div')
  div.innerHTML = `
    <h2>${htmlText(title)}</h2>
    <p>${htmlText(content)}</p>
  `
  document.querySelector('.syllabus').append(div)
}

/**
 * @typedef {{ date: string, work: string }} Session
 */

const frenchMonths = 'janvier, février, mars, avril, mai, juin, juillet, août, septembre, octobre, novembre, décembre'.split(/,\s/)
/** @type{{ mm: number, yyyy: number, sessions: Session[] }[]} */
const months = []
function getMonth(mm, yyyy) {
  const month = months.find(m => m.mm == mm)
  if (month) {
    return month
  } else {
    const month = { mm: mm, yyyy, sessions: [] }
    months.push(month)
    return month
  }
}

for (const session of sessions.sessions) {
  const [dateStr,] = session.date.split(/\s*-\s*/)
  const [_, mm, yyyy] = dateStr.split(/\//).map(x => Number.parseInt(x))
  const month = getMonth(mm, yyyy)
  month.sessions.push(session)
}

for (const month of months) {
  const div = document.createElement('div')
  div.innerHTML = `
    <h2>${frenchMonths[month.mm - 1]} ${month.yyyy}</h2>
    <ul>
      ${month.sessions.map(s => `<li>${s.date.split(/\s*-\s*/)[0]}<br>${htmlText(s.work, 1)}</li>`).join('\n')}
    </ul>
  `
  document.querySelector('.sessions').append(div)
}
