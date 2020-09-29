import resetAllCurviness from './resetAllCurviness'

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
        .filter((r) => r.isRendered)

      resetAllCurviness(editor, annotationData, relations)
      jsPlumbInstance.repaintEverything()

      for (const selectedRelation of selectionModel.relation.all) {
        if (selectedRelation.isRendered) {
          selectedRelation.jsPlumbConnection.select()
        }
      }

      // For tuning
      // var endTime = new Date();
      // console.log(editor.editorId, 'arrangePositionAll : ', endTime.getTime() - startTime.getTime() + 'ms');

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
