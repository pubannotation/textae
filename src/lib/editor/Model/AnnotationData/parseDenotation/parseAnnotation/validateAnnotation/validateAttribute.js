import validate from './validate'
import isContains from './isContains'

export default function(denotations, annotations) {
  const resultAttributeSubj = validate(annotations, isContains, {
    property: 'subj',
    dictionary: denotations
  })
  const errorCount = resultAttributeSubj.reject.length

  return {
    accept: resultAttributeSubj.accept,
    reject: {
      subj: resultAttributeSubj.reject,
      hasError: errorCount !== 0
    }
  }
}
