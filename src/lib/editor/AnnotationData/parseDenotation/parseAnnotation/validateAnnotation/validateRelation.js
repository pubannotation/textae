import isContains from './isContains'
import ValidationResults from './ValidationResults'

export default function(denotations, relations) {
  const resultRelationObj = new ValidationResults(relations, (rel) =>
    isContains(denotations, rel, 'obj')
  )
  const resultRelationSubj = new ValidationResults(
    resultRelationObj.acceptedNodes,
    (rel) => isContains(denotations, rel, 'subj')
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
