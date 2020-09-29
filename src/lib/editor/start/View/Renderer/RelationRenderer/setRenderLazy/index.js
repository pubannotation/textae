import renderLazy from './renderLazy'

export default function(relation) {
  Object.assign(relation, {
    render(jsPlumbInstance, editor, annotationData, typeDefinition) {
      return renderLazy(
        editor,
        annotationData,
        relation,
        jsPlumbInstance,
        typeDefinition
      )
    }
  })
}
