import { RemoveCommand, CreateCommand } from '../commandTemplate'
import ChangeAttributeCommand from '../ChangeAttributeCommand'

export default function (items, attributes, annotationData, editor) {
  const changeAttributeCommnads = []

  for (const item of items) {
    if (item.typeValues) {
      for (const oldAttribute of item.attributes) {
        const newAttribute = attributes.find((a) =>
          oldAttribute.equalsTo(a.pred, a.obj)
        )
        if (newAttribute) {
          if (String(oldAttribute.obj) !== newAttribute.obj) {
            changeAttributeCommnads.push(
              new ChangeAttributeCommand(
                annotationData,
                oldAttribute,
                newAttribute.pred,
                newAttribute.obj
              )
            )
          }
        } else {
          changeAttributeCommnads.push(
            new RemoveCommand(editor, annotationData, 'attribute', oldAttribute)
          )
        }
      }
    }

    for (const newAttribute of attributes) {
      if (
        !item.attributes.some((a) =>
          a.equalsTo(newAttribute.pred, newAttribute.obj)
        )
      ) {
        changeAttributeCommnads.push(
          new CreateCommand(editor, annotationData, 'attribute', {
            subj: item.id,
            pred: newAttribute.pred,
            obj: newAttribute.obj
          })
        )
      }
    }
  }

  return changeAttributeCommnads
}
