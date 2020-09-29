import renderLazy from './renderLazy'

export default function(
  relations,
  jsPlumbInstance,
  editor,
  annotationData,
  typeDefinition
) {
  // Render relations unless rendered.
  return Promise.all(
    relations
      .filter((r) => !r.isRendered)
      .map((r) =>
        renderLazy(editor, annotationData, r, jsPlumbInstance, typeDefinition)
      )
  ).catch((reason) => {
    console.error('error in renderLazyRelationAll', reason)
  })
}
