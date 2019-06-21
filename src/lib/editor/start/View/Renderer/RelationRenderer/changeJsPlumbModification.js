import Connect from './Connect'
import LabelOverlay from './LabelOverlay'

export default function(editor, annotationData, modification, relation) {
  const connect = new Connect(editor, annotationData, relation.id)

  // A connect may be an object before it rendered.
  if (connect instanceof jsPlumb.Connection) {
    modification.update(new LabelOverlay(connect).getElement(), relation.id)
  }
}
