import validateSpan from './validateSpan'
import Validation from './Validation'

export default function (text, denotations) {
  const result = validateSpan(text, denotations)
  const uniqIDValidation = new Validation(
    result.accept,
    (node) => result.accept.filter((n) => n.id === node.id).length === 1
  )

  return {
    accept: uniqIDValidation.validNodes,
    reject: Object.assign(result.reject, {
      duplicatedID: uniqIDValidation.invalidNodes
    }),
    hasError: result.hasError || uniqIDValidation.invalid
  }
}
