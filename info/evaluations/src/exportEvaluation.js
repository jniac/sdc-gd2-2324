import { promotion, artefactEvaluation } from './data.js'

const csv = Papa.unparse([
  artefactEvaluation.regularCriteria.map(c => c.name),
])
console.log(csv)