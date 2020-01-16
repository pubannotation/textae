import Selector from '../../../Selector'
import changeCssClass from './changeCssClass'
import removeListeners from './removeListeners'

export default class {
  constructor(editor, annotationData, buttonStateHelper) {
    this._editor = editor
    this._buttonStateHelper = buttonStateHelper

    const selector = new Selector(editor, annotationData)

    // This notify is off at relation-edit-mode.
    this._entitySelectChanged = (id) => {
      buttonStateHelper.updateByEntity()
      selector.entityLabel.update(id)
    }
  }

  setTerm() {
    changeCssClass(this._editor, 'term')
    removeListeners(this._editor, this._entitySelectChanged)

    this._editor.eventEmitter
      .on('textae.selection.entity.select', this._entitySelectChanged)
      .on('textae.selection.entity.deselect', this._entitySelectChanged)
  }

  setInstance() {
    changeCssClass(this._editor, 'instance')
    removeListeners(this._editor, this._entitySelectChanged)

    this._editor.eventEmitter
      .on('textae.selection.entity.select', this._entitySelectChanged)
      .on('textae.selection.entity.deselect', this._entitySelectChanged)
  }

  setRelation() {
    changeCssClass(this._editor, 'relation')
    removeListeners(this._editor, this._entitySelectChanged)
  }
}
