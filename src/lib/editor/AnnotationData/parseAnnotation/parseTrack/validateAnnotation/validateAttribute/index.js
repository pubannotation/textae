import isContains from '../isContains'
import ChainValidation from '../ChainValidation'
import areSubjAndPredUniqueIn from './areSubjAndPredUniqueIn'

export default function (denotations, attributes) {
  return new ChainValidation(attributes)
    .and('subject', (a) => isContains(denotations, a.subj))
    .and('unique', (node) => areSubjAndPredUniqueIn(attributes, node))
    .validateAll()
}
