import Selector from '../../../Selector'
import changeCssClass from './changeCssClass'
import removeListeners from './removeListeners'

export default function(editor, annotationData, selectionModel, buttonStateHelper) {
  const selector = new Selector(editor, annotationData)

  // This notify is off at relation-edit-mode.
  const entitySelectChanged = () => {
    buttonStateHelper.updateByEntity()
    selector.entityLabel.update()
  }

  const api = {
    setTerm() {
      changeCssClass(editor, 'term')
      removeListeners(selectionModel, entitySelectChanged, buttonStateHelper)

      selectionModel
        .on('entity.select', entitySelectChanged)
        .on('entity.deselect', entitySelectChanged)
        .on('entity.change', () => buttonStateHelper.updateByEntity())
    },
    setInstance() {
      changeCssClass(editor, 'instance')
      removeListeners(selectionModel, entitySelectChanged, buttonStateHelper)

      selectionModel
        .on('entity.select', entitySelectChanged)
        .on('entity.deselect', entitySelectChanged)
        .on('entity.change', () => buttonStateHelper.updateByEntity())
    },
    setRelation() {
      changeCssClass(editor, 'relation')
      removeListeners(selectionModel, entitySelectChanged, buttonStateHelper)
    }
  }

  return api
}
