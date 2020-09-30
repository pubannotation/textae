import renderLazy from './renderLazy'

export default function(
  relations,
  jsPlumbInstance,
  editor,
  annotationData,
  typeDefinition
) {
  // Render relations unless rendered.
  relations
    .filter((r) => !r.isRendered)
    .forEach((r) =>
      renderLazy(editor, annotationData, r, jsPlumbInstance, typeDefinition)
    )
}
