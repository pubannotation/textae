import isContains from './isContains'
import ChainValidation from './ChainValidation'

function areSubjAndPredUniqueIn(attributes, node) {
  return (
    attributes.filter((a) => a.subj === node.subj && a.pred === node.pred)
      .length === 1
  )
}

export default function (denotations, attributes) {
  const [accepts, errorMap] = new ChainValidation(attributes)
    .and('subject', (a) => isContains(denotations, a.subj))
    .and('unique', (node) => areSubjAndPredUniqueIn(attributes, node))
    .validate()

  return {
    accept: accepts,
    reject: {
      subj: errorMap.get('subject') || [],
      duplicatedAttributes: errorMap.get('unique') || []
    },
    hasError: errorMap.size
  }
}
