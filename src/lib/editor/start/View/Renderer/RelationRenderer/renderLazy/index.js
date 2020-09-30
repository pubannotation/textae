import render from './render'
import areEndpointsPrepared from './areEndpointsPrepared'

// The jsPlumb error occurs when a relation between same points.
// And entities of same length spans was same point before moving grids.
// A relaiton will be rendered after moving grids.
export default function(
  editor,
  annotationData,
  relation,
  jsPlumbInstance,
  typeDefinition
) {
  // The grid and its endpoints may be destroyed
  // when the spans was moved repetitively by undo or redo.
  if (!areEndpointsPrepared(annotationData, relation.id)) {
    return
  }

  render(jsPlumbInstance, editor, annotationData, typeDefinition, relation)
}
