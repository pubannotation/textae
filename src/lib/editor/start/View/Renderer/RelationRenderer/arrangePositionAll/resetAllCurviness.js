import determineCurviness from '../determineCurviness'
import JsPlumbArrow from '../JsPlumbArrow'

export default function(editor, annotationData, relations) {
  for (const relation of relations) {
    const jsPlumbConnection = relation.jsPlumbConnection
    const curviness = determineCurviness(editor, annotationData, relation)

    // Set changed values only.
    if (jsPlumbConnection.connector.getCurviness() !== curviness) {
      jsPlumbConnection.setConnector([
        'Bezier',
        {
          curviness
        }
      ])
      // Re-set arrow because it is disappered when setConnector is called.
      new JsPlumbArrow(jsPlumbConnection).resetArrows()
    }
  }
}
