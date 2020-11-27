import isContains from './isContains'
import ChainValidation from './ChainValidation'

export default function (denotations, relations) {
  const [accepts, errorMap] = new ChainValidation(relations)
    .and('object', (r) => isContains(denotations, r.obj))
    .and('subject', (r) => isContains(denotations, r.subj))
    .validate()

  return {
    accept: accepts,
    reject: {
      obj: errorMap.get('object') || [],
      subj: errorMap.get('subject') || []
    },
    hasError: errorMap.size > 0
  }
}
