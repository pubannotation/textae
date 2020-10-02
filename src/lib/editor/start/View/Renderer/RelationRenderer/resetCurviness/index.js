import determineCurviness from '../determineCurviness'
import resetArrow from './resetArrow'

export default function(relation) {
  const jsPlumbConnection = relation.jsPlumbConnection

  // The entity renderer rewrites the entire entity.
  // An endpoint may be missing from the document's context.
  // In that case, the entity renderer retrieves them again.
  let sourceEndpoint = jsPlumbConnection.endpoints[0].element
  if (!sourceEndpoint.parent) {
    sourceEndpoint = document.getElementById(sourceEndpoint.id)
  }

  let targetEndpoint = jsPlumbConnection.endpoints[1].element
  if (!targetEndpoint.parent) {
    targetEndpoint = document.getElementById(targetEndpoint.id)
  }

  const curviness = determineCurviness(sourceEndpoint, targetEndpoint)

  // Set changed values only.
  if (jsPlumbConnection.connector.getCurviness() !== curviness) {
    jsPlumbConnection.setConnector([
      'Bezier',
      {
        curviness
      }
    ])

    // Re-set arrow because it is disappered when setConnector is called.
    resetArrow(jsPlumbConnection)
  }
}
