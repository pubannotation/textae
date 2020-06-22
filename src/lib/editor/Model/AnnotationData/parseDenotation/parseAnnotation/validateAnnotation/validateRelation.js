import validate from './validate'
import isContains from './isContains'

export default function(denotations, relations) {
  const resultRelationObj = validate(relations, isContains, {
    property: 'obj',
    dictionary: denotations
  })
  const resultRelationSubj = validate(
    resultRelationObj.acceptedNodes,
    isContains,
    {
      property: 'subj',
      dictionary: denotations
    }
  )
  const errorCount =
    resultRelationObj.rejectedNodes.length +
    resultRelationSubj.rejectedNodes.length

  return {
    accept: resultRelationSubj.acceptedNodes,
    reject: {
      obj: resultRelationObj.rejectedNodes,
      subj: resultRelationSubj.rejectedNodes
    },
    hasError: errorCount !== 0
  }
}
