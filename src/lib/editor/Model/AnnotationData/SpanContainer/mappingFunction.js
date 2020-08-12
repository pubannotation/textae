import ObjectSpanModel from './ObjectSpanModel'
import StyleSpanModel from './StyleSpanModel'

export default function(denotations, editor, entityContainer, spanContainer) {
  denotations = denotations || []

  return denotations.map((entity) => {
    if (entity.style) {
      return new StyleSpanModel(
        editor,
        entity.span,
        spanContainer,
        entity.style
      )
    } else {
      return new ObjectSpanModel(
        editor,
        entity.span,
        entityContainer,
        spanContainer
      )
    }
  })
}
