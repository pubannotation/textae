import isContains from './isContains'
import Validation from './Validation'

export default function(denotations, attributes) {
  const subjectValidation = new Validation(attributes, (attr) =>
    isContains(denotations, attr, 'subj')
  )
  const errorCount = subjectValidation.invalidNodes.length

  return {
    accept: subjectValidation.validNodes,
    reject: {
      subj: subjectValidation.invalidNodes
    },
    hasError: errorCount !== 0
  }
}
