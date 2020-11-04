import IsNotCrossingValidation from './IsNotCrossingValidation'
import setSourceProperty from './setSourceProperty'

export default function (typesettings, denotations) {
  // Merge type settings and denotations
  const spans = typesettings
    .map((n) => setSourceProperty(n, 'typesettings'))
    .concat(denotations.map((n) => setSourceProperty(n, 'denotations')))

  const validation = new IsNotCrossingValidation(spans)
  const acceptedTypesettings = validation.validNodes.filter(
    (n) => n.sourceProperty === 'typesettings'
  )
  const acceptedDenotations = validation.validNodes.filter(
    (n) => n.sourceProperty === 'denotations'
  )
  const isNotCrossing = validation.invalidNodes

  return {
    acceptedTypesettings,
    acceptedDenotations,
    reject: {
      isNotCrossing
    },
    hasError: validation.invalid
  }
}
