import ChainValidation from './ChainValidation'
import isContains from './isContains'

export default function (denotations, relations) {
  return new ChainValidation(relations)
    .and('object', (r) => isContains(denotations, r.obj))
    .and('subject', (r) => isContains(denotations, r.subj))
    .validateAll()
}
