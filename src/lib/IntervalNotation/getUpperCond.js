import gt from './gt'
import gte from './gte'

export default function (str) {
  if (str.endsWith(']')) {
    return (left) => gte(left, new Number(str.replace(']', '')))
  }
  if (str.endsWith(')')) {
    return (left) => gt(left, new Number(str.replace(')', '')))
  }
  throw `${str} is not valid interval notation`
}
