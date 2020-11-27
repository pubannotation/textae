import UniqueIDValidation from './UniqueIDValidation'
import validateSpan from './validateSpan'
import Validation from './Validation'

export default function (text, blocks) {
  const result = validateSpan(text, blocks)
  const uniqIDValidation = new UniqueIDValidation(result.accept)
  const uniqRangeValidation = new Validation(
    uniqIDValidation.validNodes,
    ({ span }) =>
      uniqIDValidation.validNodes.filter(
        ({ span: otherSpan }) =>
          (span.begin === otherSpan.begin) & (span.end === otherSpan.end)
      ).length === 1
  )

  return {
    accept: uniqRangeValidation.validNodes,
    reject: Object.assign(result.reject, {
      duplicatedID: uniqIDValidation.invalidNodes,
      duplicatedRange: uniqRangeValidation.invalidNodes
    }),
    hasError:
      result.hasError || uniqIDValidation.invalid || uniqRangeValidation.invalid
  }
}
