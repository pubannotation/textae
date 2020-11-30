import getSpanValidation from './getSpanValidation'

export default function (text, denotations, spans) {
  return getSpanValidation(denotations, text, spans)
    .and(
      'uniqueID',
      (n) => denotations.filter((d) => d.id === n.id).length === 1
    )
    .validate()
}
