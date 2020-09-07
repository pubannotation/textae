import validate from './validate'
import isContains from './isContains'

export default function(denotations, relations) {
  const resultRelationObj = validate(relations, (rel) =>
    isContains(denotations, rel, 'obj')
  )
  const resultRelationSubj = validate(resultRelationObj.acceptedNodes, (rel) =>
    isContains(denotations, rel, 'subj')
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
