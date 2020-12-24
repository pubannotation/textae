import isContains from '../isContains'
import ChainValidation from '../ChainValidation'
import isUniqueIn from './isUniqueIn'

export default function (denotations, attributes) {
  return new ChainValidation(attributes)
    .and('subject', (a) => isContains(denotations, a.subj))
    .and('unique', (node) => isUniqueIn(attributes, node))
    .validateAll()
}
