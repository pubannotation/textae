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
        r.render(jsPlumbInstance, editor, annotationData, typeDefinition)
      )
  ).catch((reason) => {
    console.error('error in renderLazyRelationAll', reason)
  })
}
