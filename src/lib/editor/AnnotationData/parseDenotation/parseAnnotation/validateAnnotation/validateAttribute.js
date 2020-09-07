import SubjectValidation from './SubjectValidation'

export default function(denotations, attributes) {
  const subjectValidation = new SubjectValidation(denotations, attributes)

  return {
    accept: subjectValidation.validNodes,
    reject: {
      subj: subjectValidation.invalidNodes
    },
    hasError: subjectValidation.invalid
  }
}
