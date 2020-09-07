import ValidationResults from './ValidationResults'

export default function(nodes, predicate) {
  if (!nodes) return new ValidationResults()

  return nodes.reduce((results, target, index) => {
    // This variable only for isNotSpanCrossing.
    const nodesBeforeTarget = nodes.slice(0, index)

    if (predicate(target, nodesBeforeTarget)) {
      results.accept(target)
    } else {
      results.reject(target)
    }

    return results
  }, new ValidationResults())
}
