import SubjectValidation from './SubjectValidation'
import UniqueAttributeValidation from './UniqueAttributeValidaiton'

export default function (denotations, attributes) {
  const subjectValidation = new SubjectValidation(denotations, attributes)
  const uniqValidation = new UniqueAttributeValidation(
    subjectValidation.validNodes
  )

  return {
    accept: uniqValidation.validNodes,
    reject: {
      subj: subjectValidation.invalidNodes,
      duplicatedAttributes: uniqValidation.invalidNodes
    },
    hasError: subjectValidation.invalid || uniqValidation.invalid
  }
}
