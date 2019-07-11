import Pointupable from './Pointupable'

export default function(editor, annotationData, typeDefinition, connect) {
  const pointupable = new Pointupable(editor, annotationData, typeDefinition, connect)

  return Object.assign(connect, {
    pointup() {
      pointupable.pointup()
    },
    pointdown() {
      pointupable.pointdown()
    },
    select() {
      pointupable.select()
    },
    deselect() {
      pointupable.deselect()
    }
  })
}
