import Connect from '../Connect'
import determineCurviness from '../determineCurviness'
import JsPlumbArrow from '../JsPlumbArrow'

export default function(editor, annotationData, relations) {
  relations
    .map((relation) => {
      return {
        connect: new Connect(editor, annotationData, relation.id),
        curviness: determineCurviness(editor, annotationData, relation)
      }
    })
    // Set changed values only.
    .filter(
      (data) =>
        data.connect.setConnector &&
        data.connect.connector.getCurviness() !== data.curviness
    )
    .forEach((data) => {
      data.connect.setConnector([
        'Bezier',
        {
          curviness: data.curviness
        }
      ])
      // Re-set arrow because it is disappered when setConnector is called.
      new JsPlumbArrow(data.connect).resetArrows()
    })
}
