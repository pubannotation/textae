import gt from './gt'
import gte from './gte'

export default function (str) {
  if (str.startsWith('[')) {
    return (right) => gte(new Number(str.replace('[', '')), right)
  }
  if (str.startsWith('(')) {
    return (right) => gt(new Number(str.replace('(', '')), right)
  }
  throw `${str} is not valid interval notation`
}
