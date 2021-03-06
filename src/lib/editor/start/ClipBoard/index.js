import TypeValues from '../../TypeValues'
import EntityModel from '../../EntityModel'
import getSelectedEntities from './getSelectedEntities'

export default class ClipBoard {
  constructor(editor, commander, selectionModel) {
    this._editor = editor
    this._commander = commander
    this._selectionModel = selectionModel

    // This list stores two types of things: type for copy and entity for cut.
    // Only one type is stored at a time.
    // Use one list.
    this._items = []

    editor.eventEmitter
      .on('textae-event.annotation-data.entity.remove', (entity) => {
        if (this.hasCuttingItem) {
          this._updateItems(new Set(this._items.filter((e) => e != entity)))
        }
      })
      .on('textae-event.edit-mode.transition', () => this._updateItems())
  }

  get hasCopyingItem() {
    return this._items[0] instanceof TypeValues
  }

  get hasCuttingItem() {
    return this._items[0] instanceof EntityModel
  }

  copyEntities() {
    // Map entities to types, because entities may be delete.
    const copyingItems = [...getSelectedEntities(this._selectionModel)].reduce(
      (set, e) => set.add(e.typeValues),
      new Set()
    )

    this._updateItems(copyingItems)
  }

  cutEntities() {
    const newItems = getSelectedEntities(this._selectionModel)

    //  When exactly the same entities that are being cut are selected, the cut is canceled.
    if (
      this._cuttingItems.length &&
      this._cuttingItems.every((item) => newItems.has(item)) &&
      [...newItems].every((item) => this._cuttingItems.includes(item))
    ) {
      this._updateItems()
    } else {
      this._updateItems(newItems)
    }
  }

  pasteEntities() {
    if (this.hasCopyingItem) {
      const command = this._commander.factory.pasteTypesToSelectedSpansCommand(
        this._items
      )
      this._commander.invoke(command)

      return
    }

    if (
      this._itemsWillBeCutAndPaste.length &&
      this._selectionModel.span.single
    ) {
      const command = this._commander.factory.moveEntitiesToSelectedSpansCommand(
        this._itemsWillBeCutAndPaste
      )
      this._commander.invoke(command)
      this._updateItems()

      return
    }
  }

  // Notify items that are cutting and items that are no longer cutting
  // in order to switch between highlighting entities that are cutting.
  _updateItems(newItems = new Set()) {
    const oldItems = this._cuttingItems.filter((i) => !newItems.has(i))
    this._items = [...newItems]

    this._editor.eventEmitter.emit(
      'textae-event.clip-board.change',
      this._cuttingItems,
      oldItems
    )
  }

  // Exclude entities of the selected span.
  // When you cut and paste an entity,
  // the destination of the entity is the selected span.
  // If the destination and source spans are the same,
  // there is no change in the model.
  // In order to cause no change in the command history,
  // if the span of the entity being cut is the same as the span being selected, the entity is not pasted.
  get _itemsWillBeCutAndPaste() {
    return this._cuttingItems.filter(
      (i) =>
        i.span.id !==
        (this._selectionModel.span.single &&
          this._selectionModel.span.single.id)
    )
  }

  get _cuttingItems() {
    return this.hasCuttingItem ? this._items : []
  }
}
