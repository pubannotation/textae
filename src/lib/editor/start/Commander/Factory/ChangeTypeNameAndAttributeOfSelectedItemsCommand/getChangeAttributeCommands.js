import { RemoveCommand, CreateCommand } from '../commandTemplate'
import ChangeAttributeCommand from '../ChangeAttributeCommand'

export default function (elements, attributes, annotationData, editor) {
  const changeAttributeCommnads = []

  for (const element of elements) {
    if (element.typeValues) {
      for (const oldAttribute of element.attributes) {
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
        !element.attributes.some((a) =>
          a.equalsTo(newAttribute.pred, newAttribute.obj)
        )
      ) {
        changeAttributeCommnads.push(
          new CreateCommand(editor, annotationData, 'attribute', {
            subj: element.id,
            pred: newAttribute.pred,
            obj: newAttribute.obj
          })
        )
      }
    }
  }

  return changeAttributeCommnads
}
