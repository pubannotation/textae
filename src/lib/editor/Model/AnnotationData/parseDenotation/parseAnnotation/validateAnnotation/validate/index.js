import Reject from './Reject'

export default function(values, predicate, predicateOption) {
  if (!values) return new Reject()

  return values.reduce((result, target, index) => {
    // This variable only for isNotSpanCrossing.
    const nodesBeforeTarget = values.slice(0, index)

    if (predicate(target, predicateOption, nodesBeforeTarget)) {
      result.accept.push(target)
    } else {
      result.reject.push(target)
    }

    return result
  }, new Reject())
}
