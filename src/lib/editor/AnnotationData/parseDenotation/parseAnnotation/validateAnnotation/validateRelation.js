import isContains from './isContains'
import Validation from './Validation'
import SubjectValidation from './SubjectValidation'

export default function(denotations, relations) {
  const objectValidation = new Validation(relations, (rel) =>
    isContains(denotations, rel, 'obj')
  )
  const subjectValidation = new SubjectValidation(
    denotations,
    objectValidation.validNodes
  )

  return {
    accept: subjectValidation.validNodes,
    reject: {
      obj: objectValidation.invalidNodes,
      subj: subjectValidation.invalidNodes
    },
    hasError: objectValidation.invalid || subjectValidation.invalid
  }
}
