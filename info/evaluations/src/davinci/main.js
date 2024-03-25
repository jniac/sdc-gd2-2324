import { capitalize } from '../utils.js'
import { promotion } from '../data.js'

const sectionEvaluation = document.querySelector('section.evaluation')

function row({
  classList = [],
  dataId = 'header',
  index = -1,
  names = 'Noms',
  ids = '(prefix) github',
  page = '<span class="icon web" style="font-size: 1.2em"></span>',
  artFolder = '<span class="icon folder" style="font-size: 1.2em"></span>',
} = {}) {
  const div = document.createElement('div')
  div.dataset.id = dataId
  div.classList.add('row', ...classList)

  div.innerHTML = /* html */ `
    <div class="index mono">${index === -1 ? '' : index + 1}</div>
    <div class="names">${names}</div>
    <div class="ids mono">${ids}</div>
    <div class="page">${page}</div>
    <div class="art-folder">${artFolder}</div>
  `
  sectionEvaluation.append(div)
  return div
}

export function initEvaluationSection() {
  row({
    classList: ['header'],
  })

  for (const [index, student] of promotion.promotion.entries()) {
    const { names, github, prefix } = student
    const page = `../../art/${github}/contribution-davinci/`

    row({
      dataId: github,
      classList: ['student'],
      index,
      names: names.map(capitalize).join(' '),
      ids: `
        <span>(${prefix})</span>
        <a href="https://github.com/${github}">${github}</a>
      `,
      page: `<a href="${page}"><span class="icon web" style="font-size: 1.2em"></span></a>`,
      artFolder: `<a href="https://github.com/jniac/sdc-gd2-2324/tree/main/art/${github}/artefact"><span class="icon folder" style="font-size: 1.2em"></span></a>`,
    })
  }
}

initEvaluationSection()
