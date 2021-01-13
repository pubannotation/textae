import { RemoveCommand, CreateCommand } from '../commandTemplate'
import ChangeAttributeCommand from '../ChangeAttributeCommand'

export default function (
  elements,
  attributes,
  annotationData,
  editor,
  selectionModel
) {
  const changeAttributeCommnads = []

  for (const entity of elements) {
    for (const oldAttribute of entity.attributes) {
      const newAttribute = attributes.find((a) => oldAttribute.pred === a.pred)
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
          new RemoveCommand(
            editor,
            annotationData,
            selectionModel,
            'attribute',
            oldAttribute.id
          )
        )
      }
    }

    for (const newAttribute of attributes) {
      if (!entity.attributes.some((a) => newAttribute.pred === a.pred)) {
        changeAttributeCommnads.push(
          new CreateCommand(
            editor,
            annotationData,
            selectionModel,
            'attribute',
            false,
            {
              subj: entity.id,
              pred: newAttribute.pred,
              obj: newAttribute.obj
            }
          )
        )
      }
    }
  }

  return changeAttributeCommnads
}
