import onlyNumber from './onlyNumber'
import isWellFormed from './isWellFormed'

export default function (ids, prefix) {
  return ids.filter((id) => isWellFormed(prefix, id)).map(onlyNumber)
}
