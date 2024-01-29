import { artefactEvaluation } from './data.js'

const hoverInfoElement = document.querySelector('.hover-info')

function show(rect, innerHTML) {
  document.querySelector('.hover-info').classList.remove('hidden')
  const x = rect.left + rect.width / 2 - hoverInfoElement.offsetWidth / 2
  const y = rect.bottom + 8
  const horizontalMargin = 8
  const left = Math.min(x, window.innerWidth - hoverInfoElement.offsetWidth - horizontalMargin)
  hoverInfoElement.style.left = `${left}px`
  hoverInfoElement.style.top = `${y}px`
  hoverInfoElement.innerHTML = innerHTML
}

function hide() {
  hoverInfoElement.classList.add('hidden')
}

function formatHeaderText(criterion) {
  return `
  <h3>${criterion.name}</h3>
  <div>
    ${criterion.desc.join('<br>')}
  </div>
  <ul>
    ${criterion.details.map(str => `<li>${str}</li>`).join('\n')}
  </ul>
`
}

function getCriterionText(criterion, work) {
  return `
    <h3>${criterion.name}</h3>
    <ul>
      ${work[criterion.id]?.comments.map(str => `<li>${str}</li>`).join('\n')}
    </ul>
  `
}

function getMainComment(work) {
  return `
    <h3>${artefactEvaluation.mainComment}</h3>
    ${work.mainComment}
  `
}

export function initHoverInfo() {
  for (const element of document.querySelectorAll('.criterion, .total')) {
    element.addEventListener('pointerover', () => {
      const criterionId = element.dataset.criterionId
      const criterion = artefactEvaluation.criteria.find(c => c.id === criterionId)
      const id = element.parentElement.dataset.id
      const rect = element.getBoundingClientRect()

      if (id === 'header') {
        const text = formatHeaderText(criterion)
        show(rect, text)
      }

      const work = artefactEvaluation.works[id]
      if (work) {
        const text = element.classList.contains('criterion')
          ? getCriterionText(criterion, work)
          : getMainComment(work)
        show(rect, text)
      }
    })

    element.addEventListener('pointerout', () => {
      hide()
    })
  }
}
