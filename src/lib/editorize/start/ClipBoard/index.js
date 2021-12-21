import TypeValues from '../../TypeValues'
import EntityModel from '../../EntityModel'
import getSelectedEntities from './getSelectedEntities'

export default class ClipBoard {
  constructor(eventEmitter, commander, selectionModel) {
    this._eventEmitter = eventEmitter
    this._commander = commander
    this._selectionModel = selectionModel

    // This list stores two types of things: type for copy and entity for cut.
    // Only one type is stored at a time.
    // Use one list.
    this._items = []

    eventEmitter
      .on('textae-event.annotation-data.entity.remove', (entity) => {
        if (this.hasCuttingItem) {
          this._updateItems(this._items.filter((e) => e != entity))
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

  copyEntities(clipboardEvent) {
    // Map entities to types, because entities may be delete.
    const copyingItems = [...getSelectedEntities(this._selectionModel)].reduce(
      (ary, e) => ary.concat([e.typeValues]),
      []
    )

    if (copyingItems.length > 0) {
      clipboardEvent.clipboardData.setData(
        'text/plain',
        JSON.stringify({
          action: 'copy',
          typeValues: copyingItems.map(({ JSON }) => JSON)
        })
      )
      clipboardEvent.preventDefault()
    }

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
      this._updateItems([...newItems])
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
      const command = this._commander.factory.moveEntitiesToSelectedSpanCommand(
        this._itemsWillBeCutAndPaste
      )
      this._commander.invoke(command)
      this._updateItems()

      return
    }
  }

  // Notify items that are cutting and items that are no longer cutting
  // in order to switch between highlighting entities that are cutting.
  _updateItems(newItems = []) {
    const oldItems = this._cuttingItems.filter((i) => !newItems.includes(i))
    this._items = newItems

    this._eventEmitter.emit(
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
