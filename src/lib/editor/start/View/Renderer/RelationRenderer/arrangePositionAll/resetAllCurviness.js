import determineCurviness from '../determineCurviness'
import JsPlumbArrow from '../JsPlumbArrow'

export default function(editor, annotationData, relations) {
  for (const relation of relations) {
    const connect = relation.connect
    const curviness = determineCurviness(editor, annotationData, relation)

    // Set changed values only.
    if (connect.connector.getCurviness() !== curviness) {
      connect.setConnector([
        'Bezier',
        {
          curviness
        }
      ])
      // Re-set arrow because it is disappered when setConnector is called.
      new JsPlumbArrow(connect).resetArrows()
    }
  }
}
