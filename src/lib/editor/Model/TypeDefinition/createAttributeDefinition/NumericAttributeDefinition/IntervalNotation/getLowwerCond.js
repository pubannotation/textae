import gte from './gte'
import gt from './gt'

export default function(str) {
  if (str.startsWith('[')) {
    return (right) => gte(new Number(str.replace('[', '')), right)
  }
  if (str.startsWith('(')) {
    return (right) => gt(new Number(str.replace('(', '')), right)
  }
  throw `${str} is not valid interval notation`
}
