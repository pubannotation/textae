import render from './render'
import areEndpointsPrepared from './areEndpointsPrepared'

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
        // The grid and its endpoints may be destroyed
        // when the spans was moved repetitively by undo or redo.
        if (!areEndpointsPrepared(annotationData, relation.relationId)) {
          return
        }

        render(
          jsPlumbInstance,
          editor,
          annotationData,
          typeDefinition,
          relation
        )

        resolve(relation)
      } catch (error) {
        reject(error)
      }
    }, 0)
  })
}
