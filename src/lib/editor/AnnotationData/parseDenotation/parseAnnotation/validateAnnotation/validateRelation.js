import isContains from './isContains'
import Validation from './Validation'

export default function(denotations, relations) {
  const objectValidation = new Validation(relations, (rel) =>
    isContains(denotations, rel, 'obj')
  )
  const subjectValidation = new Validation(
    objectValidation.acceptedNodes,
    (rel) => isContains(denotations, rel, 'subj')
  )
  const errorCount =
    objectValidation.rejectedNodes.length +
    subjectValidation.rejectedNodes.length

  return {
    accept: subjectValidation.acceptedNodes,
    reject: {
      obj: objectValidation.rejectedNodes,
      subj: subjectValidation.rejectedNodes
    },
    hasError: errorCount !== 0
  }
}
