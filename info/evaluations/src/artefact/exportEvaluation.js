import { promotion, artefactEvaluation } from '../data.js'

document.querySelector('button#csv').onclick = () => {
  const csv = Papa.unparse([
    [
      'Noms',
      'Prénoms',
      ...artefactEvaluation.regularCriteria.map(criterion => `Artefact / ${criterion.name}`),
      'Total',
      'Commentaire général',
    ],
    ...promotion.promotion.map(({ names, github }) => {
      const [firstName, lastName] = names
      const work = artefactEvaluation.works[github]
      const { grades, totalGrade } = artefactEvaluation.computeWorkGrades(work)
      return [
        lastName,
        firstName,
        ...grades,
        totalGrade,
        work?.mainComment ?? '',
      ]
    }),
  ])

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'sdc-gd2-2324-artefact-evaluation.csv'
  link.click()
}