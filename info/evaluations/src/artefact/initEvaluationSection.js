import { artefactEvaluation as evaluation, promotion } from '../data.js'
import { computeCriteriaAndTotal } from '../utils/computeCriteriaAndTotal.js'
import { capitalize } from '../utils/misc.js'

function row({
  classList = [],
  dataId = 'header',
  index = -1,
  names = 'Noms',
  ids = '(prefix) github',
  page = '<span class="icon web" style="font-size: 1.2em"></span>',
  artFolder = '<span class="icon folder" style="font-size: 1.2em"></span>',
  criteria = evaluation.criteria.map(criterion => criterion.name),
  total = 'total',
} = {}) {
  const div = document.createElement('div')
  div.dataset.id = dataId
  div.classList.add('row', ...classList)

  const criteriaHtml = criteria.map((criterion, index) => {
    return `<div data-criterion-id="${evaluation.criteria[index].id}" class="criterion hover-info-link ${criterion ? '' : 'empty'}">${criterion}</div>`
  }).join('\n')

  div.innerHTML = /* html */ `
    <div class="index mono">${index === -1 ? '' : index + 1}</div>
    <div class="names">${names}</div>
    <div class="ids mono">${ids}</div>
    <div class="page">${page}</div>
    <div class="art-folder">${artFolder}</div>
    <div class="criteria">
      ${criteriaHtml}
      <div class="total hover-info-link">${total}</div>
    </div>
  `
  return div
}

export function initEvaluationSection() {
  const sectionEvaluation = document.querySelector('section.evaluation')

  const rowHeader = row({
    classList: ['header'],
  })
  sectionEvaluation.append(rowHeader)

  for (const [index, student] of promotion.promotion.entries()) {
    const { names, github, prefix } = student
    const page = `../../art/${github}/artefact/`

    const { criteria, total } = computeCriteriaAndTotal(evaluation, github)

    const div = row({
      dataId: github,
      classList: ['student'],
      index,
      names: names.map(capitalize).join(' '),
      ids: `
        <span>(${prefix})</span>
        <a href="https://github.com/${github}">${github}</a>
        <button class="copy-button" data-clipboard-text="${github}"></button>
      `,
      page: `<a href="${page}"><span class="icon web" style="font-size: 1.2em"></span></a>`,
      artFolder: `<a href="https://github.com/jniac/sdc-gd2-2324/tree/main/art/${github}/artefact"><span class="icon folder" style="font-size: 1.2em"></span></a>`,
      criteria,
      total,
    })

    sectionEvaluation.append(div)
  }
}
