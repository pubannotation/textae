import getGridOfSpan from './GridLayout/getGridOfSpan'

export default function(spanId) {
  return $(getGridOfSpan(spanId)).find('.textae-editor__attribute').length * 18// an attribute height is 18px.
}
