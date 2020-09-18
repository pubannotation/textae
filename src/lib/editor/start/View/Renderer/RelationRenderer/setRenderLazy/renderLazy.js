import render from './render'
import isGridPrepared from './isGridPrepared'

export default function(
  editor,
  annotationData,
  relation,
  jsPlumbInstance,
  typeDefinition
) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // The grid may be destroyed when the spans was moved repetitively by undo or redo.
        if (!isGridPrepared(editor, annotationData, relation.relationId)) {
          return
        }
        if (relation.render) {
          render(
            jsPlumbInstance,
            editor,
            annotationData,
            typeDefinition,
            relation
          )
        }
        resolve(relation)
      } catch (error) {
        reject(error)
      }
    }, 0)
  })
}
