import yaml from 'https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.mjs'

export async function loadYaml(url) {
  const response = await window.fetch(url)
  if (response.status !== 200) {
    document.body.innerHTML = /* html */ `
      <h1>YAML Error</h1>
      <pre>${await response.text()}</pre>
    `
    throw new Error(`Failed to load ${url}`)
  }
  const str = await response.text()
  try {
    return yaml.load(str)
  } catch (error) {
    console.log(error)
    document.body.innerHTML = /* html */ `
      <h1>YAML Error</h1>
      <pre>${error}</pre>
    `
  }
}

/**
 * @typedef {object} Student
 * @property {string[]} names
 * @property {string} github
 * @property {string} prefix
 */

/** @type {{ promotion: Student[] }} */
export const promotion = await loadYaml(`../promotion.yaml`)

/**
 * @typedef {{
 *   id: string
 *   name: string
 *   mode: 'regular' | 'bonus/penalty'
 *   gradeWeight: number
 *   desc: string[]
 *   details: string[]
 * }} Criterion
 * 
 * @typedef {{
 *   grade: number
 *   comments: string[]
 * }} CriterionEvaluation
 * 
 * @typedef {Record<string, CriterionEvaluation>} Work
 * 
 * @typedef {{
 *   exerciseName: string
 *   mainComment: string
 *   criteria: Criterion[]
 *   regularCriteria: Criterion[]
 *   bonusCriteria: Criterion[]
 *   works: Record<string, Work>
 *   computeWorkGrades: (work?: Work) => { grades: number[], bonus: number, totalGrade: number }
 * }} Evaluation
 */

/**
 * 
 * @param {Evaluation} evaluation 
 */
function initEvaluation(evaluation) {
  evaluation.regularCriteria = evaluation.criteria
    .filter(criterion => criterion.mode === 'regular')

  evaluation.bonusCriteria = evaluation.criteria
    .filter(criterion => criterion.mode === 'bonus/penalty')

  evaluation.computeWorkGrades = (work) => {
    const { regularCriteria, bonusCriteria } = evaluation
    const bonus = bonusCriteria.reduce((sum, criterion) => {
      const grade = work?.[criterion.id]?.grade ?? 0
      return sum + grade
    }, 0)
    const grades = regularCriteria.map(criterion => (work?.[criterion.id]?.grade ?? 0) + bonus)
    const gradesWeights = regularCriteria.map(criterion => criterion.gradeWeight)
    const totalGradeWeight = gradesWeights.reduce((sum, weight) => sum + weight, 0)
    const totalGrade = Math.round(grades.reduce((sum, grade, i) => sum + grade * gradesWeights[i], 0) / totalGradeWeight * 10) / 10
    return { grades, bonus, totalGrade }
  }
}

/** @type{Evaluation} */
export const artefactEvaluation = await loadYaml(`./artefact.yaml`)
initEvaluation(artefactEvaluation)

/** @type{Evaluation} */
export const davinciEvaluation = await loadYaml(`./davinci.yaml`)
initEvaluation(davinciEvaluation)
