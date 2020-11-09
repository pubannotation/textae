import UniquIDValidation from './UniquIDValidation'
import validateSpan from './validateSpan'
import Validation from './Validation'

export default function (text, blocks) {
  const result = validateSpan(text, blocks)
  const uniqIDValidation = new UniquIDValidation(result.accept)
  const uniqRangeValidation = new Validation(
    uniqIDValidation.validNodes,
    (node) =>
      uniqIDValidation.validNodes.filter(
        (n) => n.begin === node.begin && n.end === node.end
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
