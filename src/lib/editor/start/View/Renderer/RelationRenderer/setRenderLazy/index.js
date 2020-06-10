import renderLazy from './renderLazy'
import cache from './cache'

export default function(
  jsPlumbInstance,
  editor,
  annotationData,
  typeDefinition,
  relation
) {
  Object.assign(relation, {
    relationId: relation.id,
    render() {
      return renderLazy(
        editor,
        annotationData,
        relation,
        jsPlumbInstance,
        typeDefinition
      )
    }
  })

  cache(relation, editor, annotationData)
}
