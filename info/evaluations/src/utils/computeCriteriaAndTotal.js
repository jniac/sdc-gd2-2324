/**
 * @param {import('../data').Evaluation} evaluation
 * @param {string} github 
 */
export function computeCriteriaAndTotal(evaluation, github) {
  const work = evaluation.works[github]

  if (!work) {
    return {
      criteria: evaluation.criteria.map(criterion => criterion.mode === 'regular' ? '0' : ''),
      total: '0',
    }
  }

  const { bonus, totalGrade } = evaluation.computeWorkGrades(work)

  const isBonus = bonus > 0
  const bonusStr = bonus !== 0 ? `${isBonus ? '+' : '-'}${bonus}` : ''
  const bonusClass = isBonus ? 'bonus' : 'penalty'

  const criteria = evaluation.criteria.map(criterion => {
    const base = work[criterion.id]?.grade ?? ''

    if (criterion.mode === 'bonus/penalty') {
      return `<div class="bonus-penalty ${bonusClass}">${bonusStr}</div>`
    }

    const innerHTML = bonusStr
      ? `${base + bonus} <span class="bonus-penalty small ${bonusClass}">(${base}${bonusStr})</span>`
      : base

    return `<div>${innerHTML}</div>`
  })

  return { criteria, total: totalGrade }
}
