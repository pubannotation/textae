import UniquIDValidation from './UniquIDValidation'
import validateSpan from './validateSpan'

export default function (text, denotations) {
  const result = validateSpan(text, denotations)
  const uniqIDValidation = new UniquIDValidation(result.accept)

  return {
    accept: uniqIDValidation.validNodes,
    reject: Object.assign(result.reject, {
      duplicatedID: uniqIDValidation.invalidNodes
    }),
    hasError: result.hasError || uniqIDValidation.invalid
  }
}
