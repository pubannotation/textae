import renderLazy from './renderLazy'
import cache from './cache'

export default function(jsPlumbInstance, editor, annotationData, typeContainer, modificationRenderer, relation) {
  Object.assign(relation, {
    relationId: relation.id,
    render() {
      return renderLazy(editor, annotationData, relation, jsPlumbInstance, typeContainer, modificationRenderer)
    }
  })

  cache(relation, editor, annotationData)
}
