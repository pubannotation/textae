import Reject from './Reject'

export default function(values, predicate, predicateOption) {
  if (!values) return new Reject()

  return values.reduce((result, target, index, array) => {
    if (predicate(target, predicateOption, index, array)) {
      result.accept.push(target)
    } else {
      result.reject.push(target)
    }

    return result
  }, new Reject())
}
