import { capitalize } from './utils.js'
import { promotion, artefactEvaluation } from './data.js'

function row({
  classList = [],
  dataId = 'header',
  index = -1,
  names = 'Noms',
  ids = '(prefix) github',
  page = 'page',
  criteria = null,
  total = 'total',
} = {}) {
  const div = document.createElement('div')
  div.dataset.id = dataId
  div.classList.add('row', ...classList)

  criteria ??= artefactEvaluation.criteria.map(criterion => criterion.name)
  const criteriaStr = criteria.map((criterion, index) => {
    return `<div data-criterion-id="${artefactEvaluation.criteria[index].id}" class="criterion hover-info-link">${criterion}</div>`
  }).join('\n')

  div.innerHTML = /* html */ `
    <div class="index mono">${index === -1 ? 'id' : index + 1}</div>
    <div class="names">${names}</div>
    <div class="ids mono">${ids}</div>
    <div class="page">${page}</div>
    ${criteriaStr}
    <div class="total hover-info-link">${total}</div>
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
    const criteria = artefactEvaluation.criteria.map(criterion => {
      return artefactEvaluation.works[github]?.[criterion.id]?.grade ?? ''
    })
    const total = artefactEvaluation.works[github]
      ? artefactEvaluation.criteria.reduce((sum, criterion) => {
        return sum + (artefactEvaluation.works[github][criterion.id]?.grade ?? 0) * criterion.gradeWeight
      }, 0) / artefactEvaluation.criteria.reduce((sum, criterion) => criterion.gradeWeight + sum, 0)
      : '-'

    const div = row({
      dataId: github,
      classList: ['student'],
      index,
      names: names.map(capitalize).join(' '),
      ids: `
        <span>(${prefix})</span>
        <a href="https://github.com/${github}">${github}</a>
      `,
      page: `<a href="${page}">-> artefact</a>`,
      criteria,
      total,
    })

    sectionEvaluation.append(div)
  }
}
