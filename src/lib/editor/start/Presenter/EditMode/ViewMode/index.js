import Selector from '../../../Selector'
import changeCssClass from './changeCssClass'
import removeListeners from './removeListeners'

export default class {
  constructor(editor, annotationData, selectionModel, buttonStateHelper) {
    this.editor = editor
    this.selectionModel = selectionModel
    this.buttonStateHelper = buttonStateHelper

    const selector = new Selector(editor, annotationData)

    // This notify is off at relation-edit-mode.
    this.entitySelectChanged = (id) => {
      buttonStateHelper.updateByEntity()
      selector.entityLabel.update(id)
    }
  }

  setTerm() {
    changeCssClass(this.editor, 'term')
    removeListeners(this.selectionModel, this.entitySelectChanged)

    this.selectionModel
      .on('entity.select', this.entitySelectChanged)
      .on('entity.deselect', this.entitySelectChanged)
  }

  setInstance() {
    changeCssClass(this.editor, 'instance')
    removeListeners(this.selectionModel, this.entitySelectChanged)

    this.selectionModel
      .on('entity.select', this.entitySelectChanged)
      .on('entity.deselect', this.entitySelectChanged)
  }

  setRelation() {
    changeCssClass(this.editor, 'relation')
    removeListeners(this.selectionModel, this.entitySelectChanged)
  }
}
