import isContains from '../isContains'
import ChainValidation from '../ChainValidation'
import areSubjAndPredUniqueIn from './areSubjAndPredUniqueIn'

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
