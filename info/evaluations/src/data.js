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
 * @typedef {{
 *   exerciseName: string
 *   mainComment: string
 *   criteria: Criterion[]
 *   regularCriteria: Criterion[]
 *   bonusCriteria: Criterion[]
 *   works: Record<string, Record<string, CriterionEvaluation>>
 * }} Evaluation
 */

/** @type{Evaluation} */
const artefactEvaluation = await loadYaml(`./artefact.yaml`)

artefactEvaluation.regularCriteria = artefactEvaluation.criteria
  .filter(criterion => criterion.mode === 'regular')

artefactEvaluation.bonusCriteria = artefactEvaluation.criteria
  .filter(criterion => criterion.mode === 'bonus/penalty')

export { artefactEvaluation }
