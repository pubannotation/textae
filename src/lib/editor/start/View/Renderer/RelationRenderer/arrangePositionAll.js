import Connect from './Connect'
import determineCurviness from './determineCurviness'
import jsPlumbArrowOverlayUtil from './jsPlumbArrowOverlayUtil'

export default function(
  editor,
  annotationData,
  selectionModel,
  jsPlumbInstance
) {
  return new Promise((resolve, reject) => {
    try {
      // For tuning
      // var startTime = new Date();

      // Extract relations are removed or rendered not yet, because relation DOMs are render asynchronously.
      const relations = annotationData.relation.all
        .filter((r) => !r.removed)
        .filter((r) => r.render === undefined)

      resetAllCurviness(editor, annotationData, relations)
      jsPlumbInstance.repaintEverything()
      reselectAll(editor, annotationData, selectionModel.relation.all())

      // For tuning
      // var endTime = new Date();
      // console.log(editor.editorId, 'arrangePositionAll : ', endTime.getTime() - startTime.getTime() + 'ms');

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

function reselectAll(editor, annotationData, relationIds) {
  relationIds
    .map((relationId) => new Connect(editor, annotationData, relationId))
    .filter((connect) => connect instanceof jsPlumb.Connection)
    .forEach((connect) => connect.select())
}

function resetAllCurviness(editor, annotationData, relations) {
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
      jsPlumbArrowOverlayUtil.resetArrows(data.connect)
    })
}
