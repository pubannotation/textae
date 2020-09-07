import isContains from './isContains'
import Validation from './Validation'

export default function(denotations, attributes) {
  const subjectValidation = new Validation(attributes, (attr) =>
    isContains(denotations, attr, 'subj')
  )
  const errorCount = subjectValidation.rejectedNodes.length

  return {
    accept: subjectValidation.acceptedNodes,
    reject: {
      subj: subjectValidation.rejectedNodes
    },
    hasError: errorCount !== 0
  }
}
