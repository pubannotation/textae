import SpanModel from './SpanModel'

export default function(denotations, editor, entityContainer) {
  denotations = denotations || []

  return denotations
    .map((entity) => entity.span)
    .map((span) => new SpanModel(editor, span, entityContainer))
}
