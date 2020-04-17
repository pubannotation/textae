import validate from './validate'
import isContains from './isContains'

export default function(denotations, annotations) {
  const resultAttributeObj = validate(annotations, isContains, {
    property: 'obj',
    dictionary: denotations
  })
  const resultAttributeSubj = validate(annotations, isContains, {
    property: 'subj',
    dictionary: denotations
  })
  const errorCount =
    resultAttributeObj.reject.length + resultAttributeSubj.reject.length

  return {
    accept: resultAttributeSubj.accept,
    reject: {
      obj: resultAttributeObj.reject,
      subj: resultAttributeSubj.reject,
      hasError: errorCount !== 0
    }
  }
}
