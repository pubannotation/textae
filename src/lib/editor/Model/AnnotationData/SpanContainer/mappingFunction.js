import SpanModel from './ObjectSpanModel'
import StyleSpanModel from './StyleSpanModel'

export default function(denotations, editor, entityContainer) {
  denotations = denotations || []

  return denotations.map((entity) => {
    if (entity.style) {
      return new StyleSpanModel(editor, entity.span, entity.style)
    } else {
      return new SpanModel(editor, entity.span, entityContainer, entity.style)
    }
  })
}
