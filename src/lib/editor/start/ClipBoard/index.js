import TypeModel from '../../TypeModel'
import EntityModel from '../../Model/AnnotationData/EntityContainer/EntityModel'
import getSelectedEntities from './getSelectedEntities'

export default class {
  constructor(editor, commander, selectionModel) {
    this._editor = editor
    this._commander = commander
    this._selectionModel = selectionModel

    // This list stores two types of things: type for copy and entity for cut.
    // Only one type is stored at a time.
    // Use one list.
    this._items = []

    editor.eventEmitter.on('textae.annotationData.entity.remove', (entity) => {
      if (this.hasCuttingItem) {
        this._items = this._items.filter((e) => e != entity)
      }
    })
  }

  get hasCopyingItem() {
    return this._items[0] instanceof TypeModel
  }

  get hasCuttingItem() {
    return this._items[0] instanceof EntityModel
  }

  copyEntities() {
    // Map entities to types, because entities may be delete.
    const copyingItems = [...getSelectedEntities(this._selectionModel)].reduce(
      (set, e) => set.add(e.type),
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
      this._updateItems(new Set())
    } else {
      this._updateItems(newItems)
    }
  }

  pasteEntities() {
    if (this.hasCopyingItem) {
      this._commander.invoke(this._pasteCommand)
    }

    if (this._itemsWillBeCutAndPaste.length) {
      this._commander.invoke(this._pasteCommand)
      this._updateItems(new Set())
    }
  }

  // Notify items that are cutting and items that are no longer cutting
  // in order to switch between highlighting entities that are cutting.
  _updateItems(newItems) {
    const oldItems = this._cuttingItems.filter((i) => !newItems.has(i))
    this._items = [...newItems]

    this._editor.eventEmitter.emit(
      'textae.clipBoard.change',
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
        i.span !==
        (this._selectionModel.span.single &&
          this._selectionModel.span.single.id)
    )
  }

  get _cuttingItems() {
    return this.hasCuttingItem ? this._items : []
  }

  get _pasteCommand() {
    if (this.hasCopyingItem) {
      return this._commander.factory.pasteTypesToSelectedSpansCommand(
        this._items
      )
    }

    if (this._itemsWillBeCutAndPaste.length) {
      return this._commander.factory.moveEntitiesToSelectedSpansCommand(
        this._itemsWillBeCutAndPaste
      )
    }

    throw 'There is no item to be copied or to be cut'
  }
}
