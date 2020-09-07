import ValidationResults from './ValidationResults'

export default function(values, predicate) {
  if (!values) return new ValidationResults()

  return values.reduce((results, target, index) => {
    // This variable only for isNotSpanCrossing.
    const nodesBeforeTarget = values.slice(0, index)

    if (predicate(target, nodesBeforeTarget)) {
      results.accept(target)
    } else {
      results.reject(target)
    }

    return results
  }, new ValidationResults())
}
