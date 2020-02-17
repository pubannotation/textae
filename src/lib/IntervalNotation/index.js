import getLowwerCond from './getLowwerCond'
import getUpperCond from './getUpperCond'

// https://www.varsitytutors.com/hotmath/hotmath_help/topics/interval-notation
export default class IntervalNotation {
  constructor(str) {
    const [left, right] = str.split(',')

    if (!right) {
      if (left.startsWith('[') || left.startsWith('(')) {
        // Upper limit is omitted
        this._lowwerCond = getLowwerCond(left)
        this._upperCond = (_) => true
      }

      if (left.endsWith(']') || left.endsWith(')')) {
        // Lowwer limit is omitted
        this._lowwerCond = (_) => true
        this._upperCond = getUpperCond(left)
      }
    } else {
      this._lowwerCond = getLowwerCond(left)
      this._upperCond = getUpperCond(right)
    }

    if (!this._lowwerCond || !this._upperCond) {
      throw `${str} is not valid interval notation`
    }
  }

  test(value) {
    return this._lowwerCond(value) && this._upperCond(value)
  }
}
