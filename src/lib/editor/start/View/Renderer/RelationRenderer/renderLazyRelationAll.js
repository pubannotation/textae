export default function(relations) {
  // Render relations unless rendered.
  return Promise.all(
    relations.filter((r) => !r.isRendered).map((r) => r.render())
  ).catch((reason) => {
    console.error('error in renderLazyRelationAll', reason)
  })
}
