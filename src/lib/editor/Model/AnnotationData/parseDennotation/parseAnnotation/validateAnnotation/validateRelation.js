import validate from './validate'
import isContains from './isContains'

export default function(denotations, relations) {
  const resultRelationObj = validate(relations, isContains, {
    property: 'obj',
    dictionary: denotations
  })
  const resultRelationSubj = validate(resultRelationObj.accept, isContains, {
    property: 'subj',
    dictionary: denotations
  })
  const errorCount =
    resultRelationObj.reject.length + resultRelationSubj.reject.length

  return {
    accept: resultRelationSubj.accept,
    reject: {
      obj: resultRelationObj.reject,
      subj: resultRelationSubj.reject,
      hasError: errorCount !== 0
    }
  }
}
