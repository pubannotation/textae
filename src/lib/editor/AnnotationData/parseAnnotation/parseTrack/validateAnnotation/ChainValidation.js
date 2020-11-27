export default class ChainValidation {
  constructor(
    candidates,
    name = '',
    predicate = () => true,
    errorMap = new Map()
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

  get _accepts() {
    return this._candidates.filter((c) => this._predicate(c))
  }

  get _rejects() {
    return this._candidates.filter((c) => !this._predicate(c))
  }

  _updateErros() {
    if (this._rejects.length > 0) {
      this._errorMap.set(this._name, this._rejects)
    }

    return this._errorMap
  }
}
