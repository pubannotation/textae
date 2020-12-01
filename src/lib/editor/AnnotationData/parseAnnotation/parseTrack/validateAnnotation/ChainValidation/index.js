import ErrorMap from './ErrorMap'

export default class ChainValidation {
  constructor(
    candidates,
    name = '',
    predicate = () => true,
    errorMap = new ErrorMap()
  ) {
    this._candidates = candidates || []
    this._name = name
    this._predicate = predicate
    this._errorMap = errorMap
  }

  and(name, predicate) {
    return new ChainValidation(
      this._accepts,
      name,
      predicate,
      this._updateErros()
    )
  }

  validate() {
    return [this._accepts, this._updateErros()]
  }

  _test(c) {
    const result = this._predicate(c)

    if (Array.isArray(result)) {
      return result[0]
    }

    return result
  }

  get _accepts() {
    return this._candidates.filter((c) => this._test(c))
  }

  get _rejects() {
    return this._candidates.filter((c) => !this._test(c))
  }

  get _inhibitors() {
    const inhibitors = new Map()

    for (const c of this._candidates) {
      const result = this._predicate(c)

      if (Array.isArray(result) && !result[0]) {
        inhibitors.set(c, result[1])
      }
    }

    return inhibitors
  }

  _updateErros() {
    if (this._rejects.length > 0) {
      this._errorMap.set(this._name, [this._rejects, this._inhibitors])
    }

    return this._errorMap
  }
}
