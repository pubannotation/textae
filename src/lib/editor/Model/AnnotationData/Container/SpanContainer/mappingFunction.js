import {isBoundaryCrossingWithOtherSpans} from '../../parseAnnotation/validateAnnotation'
import toSpanModel from './toSpanModel'

export default function(editor, emitter, paragraph, denotations) {
  denotations = denotations || []

  return denotations
    .map((entity) => entity.span)
    .map((span) => toSpanModel(editor, emitter, paragraph, span))
    .filter((span, index, array) => !isBoundaryCrossingWithOtherSpans(array.slice(0, index - 1), span))
}
