import SubjectValidation from './SubjectValidation'
import UniqAttributeValidation from './UniqAttributeValidaiton'

export default function (denotations, attributes) {
  const subjectValidation = new SubjectValidation(denotations, attributes)
  const uniqValidation = new UniqAttributeValidation(
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
