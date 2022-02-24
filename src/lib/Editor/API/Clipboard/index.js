import { v4 as uuidv4 } from 'uuid'
import TypeValues from '../../../TypeValues'
import EntityModel from '../../EntityModel'
import AttributeDefinitionContainer from '../../AttributeDefinitionContainer'

export default class Clipboard {
  /**
   * @param {import('../Commander').default} commander
   * @param {import('../SelectionModel'} selectionModel
   * @param {AttributeDefinitionContainer} attributeDefinitionContainer
   * */
  constructor(
    eventEmitter,
    commander,
    selectionModel,
    denotationDefinitionContainer,
    attributeDefinitionContainer,
    typeDefinition
  ) {
    this._eventEmitter = eventEmitter
    this._commander = commander
    this._selectionModel = selectionModel
    this._denotationDefinitionContainer = denotationDefinitionContainer
    this._attributeDefinitionContainer = attributeDefinitionContainer
    this._typeDefinition = typeDefinition

    // This list stores two types of things: type for copy and entity for cut.
    // Only one type is stored at a time.
    // Use one list.
    this._items = []
    this._uuid = uuidv4()

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

  copyEntitiesToLocalClipboard() {
    this._updateItems(this._selectionModel.copyingTargets)
  }

  copyEntitiesToSystemClipboard(clipboardEvent) {
    const { copyingTargets } = this._selectionModel

    if (copyingTargets.length > 0) {
      const entityTypes = this._denotationDefinitionContainer.config.filter(
        ({ id }) => copyingTargets.some(({ typeName }) => typeName === id)
      )

      const attributeTypes = this._attributeDefinitionContainer.config.filter(
        ({ pred }) =>
          copyingTargets.some(({ attributes }) =>
            attributes.some((a) => a.pred === pred)
          )
      )

      const dataString = JSON.stringify({
        typeValues: copyingTargets.map(({ JSON }) => JSON),
        config: {
          'entity types': entityTypes,
          'attribute types': attributeTypes
        }
      })

      clipboardEvent.clipboardData.setData('text/plain', dataString)
      clipboardEvent.clipboardData.setData(
        'application/x-textae-type-values',
        dataString
      )
      clipboardEvent.preventDefault()
    }
  }

  cutEntitiesToLocalClipboard() {
    const { cuttingTargets } = this._selectionModel

    //  When exactly the same entities that are being cut are selected, the cut is canceled.
    if (
      this._cuttingItems.length &&
      this._cuttingItems.every((item) => cuttingTargets.has(item)) &&
      [...cuttingTargets].every((item) => this._cuttingItems.includes(item))
    ) {
      this._updateItems()
    } else {
      this._updateItems([...cuttingTargets])
    }
  }

  cutEntitiesToSystemClipboard(clipboardEvent) {
    this.cutEntitiesToLocalClipboard()

    clipboardEvent.clipboardData.setData(
      'application/x-textae-editor-uuid',
      this._uuid
    )

    this.copyEntitiesToSystemClipboard(clipboardEvent)
  }

  pasteEntitiesFromLocalClipboard() {
    if (
      this._itemsWillBeCutAndPaste.length &&
      this._selectionModel.span.single
    ) {
      this._moveEntities()
      return
    }

    if (this.hasCopyingItem) {
      const command = this._commander.factory.pasteTypesToSelectedSpansCommand(
        this._items
      )
      this._commander.invoke(command)
    }
  }

  pasteEntitiesFromSystemClipboard(clipboardEvent) {
    if (this._selectionModel.span.contains((s) => s.isBlock)) {
      return
    }

    const uuid = clipboardEvent.clipboardData.getData(
      'application/x-textae-editor-uuid'
    )
    if (
      uuid === this._uuid &&
      this._itemsWillBeCutAndPaste.length &&
      this._selectionModel.span.single
    ) {
      this._moveEntities()
      return
    }

    const copyData = clipboardEvent.clipboardData.getData(
      'application/x-textae-type-values'
    )

    if (copyData) {
      const data = JSON.parse(copyData)
      const newAttrDefContainer = new AttributeDefinitionContainer()
      newAttrDefContainer.definedTypes = data.config['attribute types']

      if (this._typeDefinition.isLock) {
        const typeValuesList = data.typeValues.map(
          ({ obj, attributes }) =>
            new TypeValues(
              obj,
              attributes.filter(
                ({ pred }) =>
                  this._attributeDefinitionContainer.get(pred) &&
                  this._attributeDefinitionContainer.get(pred).valueType ===
                    newAttrDefContainer.get(pred).valueType
              )
            )
        )

        const command =
          this._commander.factory.pasteTypesToSelectedSpansCommand(
            typeValuesList
          )
        this._commander.invoke(command)
      } else {
        const typeValuesList = data.typeValues.map(
          ({ obj, attributes }) =>
            new TypeValues(
              obj,
              attributes.filter(
                ({ pred }) =>
                  !this._attributeDefinitionContainer.get(pred) ||
                  this._attributeDefinitionContainer.get(pred).valueType ===
                    newAttrDefContainer.get(pred).valueType
              )
            )
        )

        const newTypes = data.config['entity types'].filter(
          ({ id }) =>
            !this._denotationDefinitionContainer.config.some(
              (type) => type.id === id
            )
        )
        const attrDefs = data.config['attribute types'].filter(
          ({ pred }) => !this._attributeDefinitionContainer.get(pred)
        )

        const command =
          this._commander.factory.pasteTypesToSelectedSpansCommand(
            typeValuesList,
            newTypes,
            attrDefs,
            this._getNewSelectionAttributeObjects(
              typeValuesList,
              newAttrDefContainer
            )
          )
        this._commander.invoke(command)
      }

      if (this.hasCuttingItem) {
        this._updateItems()
      }

      return
    }
  }

  // If there is an attribute definition for the selection attribute to be added
  // but the value definition is missing, add the value definition.
  _getNewSelectionAttributeObjects(typeValuesList, newAttrDefContainer) {
    const newSelectionAttributeObjects = []
    const selectionAttibutes = typeValuesList.reduce((list, typeValue) => {
      return list.concat(
        typeValue.attributes.filter(
          ({ pred }) => newAttrDefContainer.get(pred).valueType === 'selection'
        )
      )
    }, [])
    for (const { pred, obj } of selectionAttibutes) {
      if (this._attributeDefinitionContainer.get(pred)) {
        if (
          !this._attributeDefinitionContainer
            .get(pred)
            .values.some(({ id }) => id === obj)
        ) {
          const value = newAttrDefContainer
            .get(pred)
            .values.find(({ id }) => id === obj)

          newSelectionAttributeObjects.push({
            pred,
            value
          })
        }
      }
    }
    return newSelectionAttributeObjects
  }

  _moveEntities() {
    const command = this._commander.factory.moveEntitiesToSelectedSpanCommand(
      this._itemsWillBeCutAndPaste
    )
    this._commander.invoke(command)
    this._updateItems()
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
