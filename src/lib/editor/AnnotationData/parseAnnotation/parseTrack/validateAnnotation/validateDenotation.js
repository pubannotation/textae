import UniqueIDValidation from './UniqueIDValidation'
import validateSpan from './validateSpan'

export default function (text, denotations, spans) {
  const result = validateSpan(text, denotations, spans)
  const uniqIDValidation = new UniqueIDValidation(result.accept)

  return {
    accept: uniqIDValidation.validNodes,
    reject: Object.assign(result.reject, {
      duplicatedID: uniqIDValidation.invalidNodes
    }),
    hasError: result.hasError || uniqIDValidation.invalid
  }
}
