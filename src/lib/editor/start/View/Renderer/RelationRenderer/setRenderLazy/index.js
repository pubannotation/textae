import renderLazy from './renderLazy'

export default function(
  jsPlumbInstance,
  editor,
  annotationData,
  typeDefinition,
  relation
) {
  Object.assign(relation, {
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
}
