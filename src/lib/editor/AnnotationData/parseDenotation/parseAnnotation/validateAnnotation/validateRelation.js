import isContains from './isContains'
import Validation from './Validation'

export default function(denotations, relations) {
  const objectValidation = new Validation(relations, (rel) =>
    isContains(denotations, rel, 'obj')
  )
  const subjectValidation = new Validation(objectValidation.validNodes, (rel) =>
    isContains(denotations, rel, 'subj')
  )
  const errorCount =
    objectValidation.invalidNodes.length + subjectValidation.invalidNodes.length

  return {
    accept: subjectValidation.validNodes,
    reject: {
      obj: objectValidation.invalidNodes,
      subj: subjectValidation.invalidNodes
    },
    hasError: errorCount !== 0
  }
}
