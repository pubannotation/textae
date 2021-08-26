import getSpanValidation from './getSpanValidation'

export default function (text, targetSpans, allSpans) {
  return getSpanValidation(
    targetSpans,
    text,
    allSpans,
    'typesettings'
  ).validateAll()
}
