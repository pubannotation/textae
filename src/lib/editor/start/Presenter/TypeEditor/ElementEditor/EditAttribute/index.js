import bindTextaeEvents from './bindTextaeEvents'
import handle from './handle'

export default class {
  constructor(commander, editor, annotationData, selectionModel, entityPallet) {
    this._commander = commander
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._pallet = entityPallet
    editor[0].appendChild(this._pallet.el)

    bindTextaeEvents(editor, selectionModel, commander, entityPallet)
  }

  handle(typeDefinition, number) {
    handle(
      this._pallet,
      this._commander,
      this._selectionModel,
      typeDefinition,
      number
    )
  }
}
