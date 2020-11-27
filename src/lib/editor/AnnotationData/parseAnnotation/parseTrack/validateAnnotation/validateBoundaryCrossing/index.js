import IsNotCrossingValidation from './IsNotCrossingValidation'
import setSourceProperty from './setSourceProperty'

export default function (typesettings, denotations) {
  // Merge type settings and denotations
  const spans = typesettings
    .map((n) => setSourceProperty(n, 'typesettings'))
    .concat(denotations.map((n) => setSourceProperty(n, 'denotations')))

  const typesettingsValidation = new IsNotCrossingValidation(
    typesettings,
    spans
  )
  const denotationsValidation = new IsNotCrossingValidation(denotations, spans)

  return {
    acceptedTypesettings: typesettingsValidation.validNodes,
    acceptedDenotations: denotationsValidation.validNodes,
    reject: {
      boundaryCrossingSpans: typesettingsValidation.invalidNodes.concat(
        denotationsValidation.invalidNodes
      )
    },
    hasError: typesettingsValidation.invalid || denotationsValidation.invalid
  }
}
