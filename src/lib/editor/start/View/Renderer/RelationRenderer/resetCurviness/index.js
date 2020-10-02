import determineCurviness from '../determineCurviness'
import resetArrow from './resetArrow'

export default function(relation, editor, annotationData) {
  const jsPlumbConnection = relation.jsPlumbConnection
  const curviness = determineCurviness(editor, annotationData, relation, jsPlumbConnection.endpoints[0].element, jsPlumbConnection.endpoints[1].element)

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
