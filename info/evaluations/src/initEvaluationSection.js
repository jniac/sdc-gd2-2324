import { capitalize } from './utils.js'
import { promotion, artefactEvaluation } from './data.js'

function row({
  classList = [],
  dataId = 'header',
  index = -1,
  names = 'Noms',
  ids = '(prefix) github',
  page = 'page',
  artFolder = 'art',
  criteria = null,
  total = 'total',
} = {}) {
  const div = document.createElement('div')
  div.dataset.id = dataId
  div.classList.add('row', ...classList)

  criteria ??= artefactEvaluation.criteria.map(criterion => criterion.name)
  const criteriaStr = criteria.map((criterion, index) => {
    return `<div data-criterion-id="${artefactEvaluation.criteria[index].id}" class="criterion hover-info-link ${criterion ? '' : 'empty'}">${criterion}</div>`
  }).join('\n')

  div.innerHTML = /* html */ `
    <div class="index mono">${index === -1 ? 'id' : index + 1}</div>
    <div class="names">${names}</div>
    <div class="ids mono">${ids}</div>
    <div class="page">${page}</div>
    <div class="art-folder">${artFolder}</div>
    ${criteriaStr}
    <div class="total hover-info-link">${total}</div>
  `
  return div
}

export function initEvaluationSection() {
  const { regularCriteria, bonusCriteria } = artefactEvaluation

  const sectionEvaluation = document.querySelector('section.evaluation')

  const rowHeader = row({
    classList: ['header'],
  })
  sectionEvaluation.append(rowHeader)

  for (const [index, student] of promotion.promotion.entries()) {
    const { names, github, prefix } = student
    const page = `../../art/${github}/artefact/`


    let criteria = artefactEvaluation.criteria.map(criterion => criterion.mode === 'regular' ? '0' : '')
    let total = '0'

    const work = artefactEvaluation.works[github]
    if (work) {
      const { bonus, totalGrade } = artefactEvaluation.computeWorkGrades(work)

      const isBonus = bonus > 0
      const bonusStr = bonus !== 0 ? `${isBonus ? '+' : '-'}${bonus}` : ''
      const bonusClass = isBonus ? 'bonus' : 'penalty'

      criteria = artefactEvaluation.criteria.map(criterion => {
        const base = work[criterion.id]?.grade ?? ''

        if (criterion.mode === 'bonus/penalty') {
          return `<div class="bonus-penalty ${bonusClass}">${bonusStr}</div>`
        }

        const innerHTML = bonusStr
          ? `${base + bonus} <span class="bonus-penalty small ${bonusClass}">(${base}${bonusStr})</span>`
          : base

        return `<div>${innerHTML}</div>`
      })

      total = totalGrade
    }

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
      artFolder: `<a href="https://github.com/jniac/sdc-gd2-2324/tree/main/art/${github}/artefact">-> art</a>`,
      criteria,
      total,
    })

    sectionEvaluation.append(div)
  }
}
