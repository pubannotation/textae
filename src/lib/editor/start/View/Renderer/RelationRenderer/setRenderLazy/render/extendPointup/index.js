import Pointupable from './Pointupable'

export default function(editor, annotationData, typeContainer, connect) {
  const pointupable = new Pointupable(editor, annotationData, typeContainer, connect)

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
