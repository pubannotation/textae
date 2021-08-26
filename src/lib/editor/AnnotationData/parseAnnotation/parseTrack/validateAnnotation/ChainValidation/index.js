import setSourceProperty from './setSourceProperty'
import ErrorMap from './ErrorMap'

export default class ChainValidation {
  constructor(
    candidates,
    sourcePropertyName,
    name = 'root',
    predicate = () => true,
    prevValidation
  ) {
    this._candidates = candidates || []
    this._name = name
    this._predicate = predicate
    ;(this._prevValidation = prevValidation),
      (this._sourcePropertyName = sourcePropertyName)
  }

  and(name, predicate) {
    return new ChainValidation(
      this._candidates,
      this._sourcePropertyName,
      name,
      predicate,
      this
    )
  }

  validateAll() {
    const errorMap = new ErrorMap()

    let validation
    let qualifieds
    for (
      validation = this, qualifieds = this._candidates;
      validation;
      validation = validation._prevValidation
    ) {
      qualifieds = validation._validate(qualifieds, this._candidates, errorMap)
    }

    return [qualifieds, errorMap]
  }

  _validate(qualifieds, candidates, errorMap) {
    if (this._getRejects(candidates).length > 0) {
      errorMap.set(this._name, [
        this._getRejects(candidates),
        this._getInhibitors(candidates)
      ])
    }

    return this._getAccepts(qualifieds)
  }

  _getAccepts(candidates) {
    return candidates.filter((c) => this._test(c))
  }

  _getRejects(candidates) {
    return candidates
      .filter((c) => !this._test(c))
      .map((n) => setSourceProperty(n, this._sourcePropertyName))
  }

  _getInhibitors(candidates) {
    const inhibitors = new Map()

    for (const c of candidates) {
      const result = this._predicate(c)

      if (Array.isArray(result) && !result[0]) {
        inhibitors.set(c, result[1])
      }
    }

    return inhibitors
  }

  // A predicate function can return both consequences and inhibitors.
  // This function returns consequences only.
  _test(c) {
    const result = this._predicate(c)

    if (Array.isArray(result)) {
      return result[0]
    }

    return result
  }
}
