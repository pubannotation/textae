import { v4 as uuidV4 } from 'uuid'
import TypeValues from '../../../TypeValues'
import AttributeDefinitionContainer from '../../AttributeDefinitionContainer'
import EntityInstance from '../../EntityInstance'

export default class Clipboard {
  #eventEmitter
  #commander
  #selectionModel
  #denotationDefinitionContainer
  #attributeDefinitionContainer
  #typeDictionary
  #items
  #uuid

  /**
   * @param {import('../Commander').default} commander
   * @param {import('../../SelectionModel').default} selectionModel
   * @param {AttributeDefinitionContainer} attributeDefinitionContainer
   * */
  constructor(
    eventEmitter,
    commander,
    selectionModel,
    denotationDefinitionContainer,
    attributeDefinitionContainer,
    typeDictionary
  ) {
    this.#eventEmitter = eventEmitter
    this.#commander = commander
    this.#selectionModel = selectionModel
    this.#denotationDefinitionContainer = denotationDefinitionContainer
    this.#attributeDefinitionContainer = attributeDefinitionContainer
    this.#typeDictionary = typeDictionary

    // This list stores two types of things: type for copy and entity for cut.
    // Only one type is stored at a time.
    // Use one list.
    this.#items = []
    this.#uuid = uuidV4()

    eventEmitter
      .on('textae-event.annotation-data.entity.remove', (entity) => {
        if (this.hasCuttingItem) {
          this.#updateItems(this.#items.filter((e) => e !== entity))
        }
      })
      .on('textae-event.edit-mode.transition', () => this.#updateItems())
  }

  get hasCopyingItem() {
    return this.#items[0] instanceof TypeValues
  }

  get hasCuttingItem() {
    return this.#items[0] instanceof EntityInstance
  }

  copyEntitiesToLocalClipboard() {
    this.#updateItems(this.#selectionModel.copyingTargets)
  }

  copyEntitiesToSystemClipboard(clipboardEvent) {
    if (this.#selectionModel.span.contains((s) => s.isBlock)) {
      return
    }

    const { copyingTargets } = this.#selectionModel

    if (copyingTargets.length > 0) {
      const entityTypes = this.#denotationDefinitionContainer.config.filter(
        ({ id }) => copyingTargets.some(({ typeName }) => typeName === id)
      )

      const attributeTypes = this.#attributeDefinitionContainer.config.filter(
        ({ pred }) =>
          copyingTargets.some(({ attributes }) =>
            attributes.some((a) => a.pred === pred)
          )
      )

      const dataString = JSON.stringify({
        typeValues: copyingTargets.map(({ externalFormat }) => externalFormat),
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
    const { cuttingTargets } = this.#selectionModel

    //  When exactly the same entities that are being cut are selected, the cut is canceled.
    if (
      this.#cuttingItems.length &&
      this.#cuttingItems.every((item) => cuttingTargets.has(item)) &&
      [...cuttingTargets].every((item) => this.#cuttingItems.includes(item))
    ) {
      this.#updateItems()
    } else {
      this.#updateItems([...cuttingTargets])
    }
  }

  cutEntitiesToSystemClipboard(clipboardEvent) {
    if (this.#selectionModel.span.contains((s) => s.isBlock)) {
      return
    }

    this.cutEntitiesToLocalClipboard()

    clipboardEvent.clipboardData.setData(
      'application/x-textae-editor-uuid',
      this.#uuid
    )

    this.copyEntitiesToSystemClipboard(clipboardEvent)
  }

  pasteEntitiesFromLocalClipboard() {
    if (
      this.#itemsWillBeCutAndPaste.length &&
      this.#selectionModel.span.single
    ) {
      this.#moveEntities()
      return
    }

    if (this.hasCopyingItem) {
      const command = this.#commander.factory.pasteTypesToSelectedSpansCommand(
        this.#items
      )
      this.#commander.invoke(command)
    }
  }

  pasteEntitiesFromSystemClipboard(clipboardEvent) {
    if (this.#selectionModel.span.contains((s) => s.isBlock)) {
      return
    }

    const uuid = clipboardEvent.clipboardData.getData(
      'application/x-textae-editor-uuid'
    )
    if (
      uuid === this.#uuid &&
      this.#itemsWillBeCutAndPaste.length &&
      this.#selectionModel.span.single
    ) {
      this.#moveEntities()
      return
    }

    const copyData = clipboardEvent.clipboardData.getData(
      'application/x-textae-type-values'
    )

    if (copyData) {
      const data = JSON.parse(copyData)
      const newAttrDefContainer = new AttributeDefinitionContainer()
      newAttrDefContainer.definedTypes = data.config['attribute types']

      if (this.#typeDictionary.isLock) {
        const typeValuesList = data.typeValues.map(
          ({ obj, attributes }) =>
            new TypeValues(
              obj,
              attributes.filter(
                ({ pred }) =>
                  this.#attributeDefinitionContainer.get(pred) &&
                  this.#attributeDefinitionContainer.get(pred).valueType ===
                    newAttrDefContainer.get(pred).valueType
              )
            )
        )

        const command =
          this.#commander.factory.pasteTypesToSelectedSpansCommand(
            typeValuesList
          )
        this.#commander.invoke(command)
      } else {
        const typeValuesList = data.typeValues.map(
          ({ obj, attributes }) =>
            new TypeValues(
              obj,
              attributes.filter(
                ({ pred }) =>
                  !this.#attributeDefinitionContainer.get(pred) ||
                  this.#attributeDefinitionContainer.get(pred).valueType ===
                    newAttrDefContainer.get(pred).valueType
              )
            )
        )

        const newTypes = data.config['entity types'].filter(
          ({ id }) =>
            !this.#denotationDefinitionContainer.config.some(
              (type) => type.id === id
            )
        )
        const attrDefs = data.config['attribute types'].filter(
          ({ pred }) => !this.#attributeDefinitionContainer.get(pred)
        )

        const command =
          this.#commander.factory.pasteTypesToSelectedSpansCommand(
            typeValuesList,
            newTypes,
            attrDefs,
            this.#getNewSelectionAttributeObjects(
              typeValuesList,
              newAttrDefContainer
            )
          )
        this.#commander.invoke(command)
      }

      if (this.hasCuttingItem) {
        this.#updateItems()
      }

      return
    }
  }

  // If there is an attribute definition for the selection attribute to be added
  // but the value definition is missing, add the value definition.
  #getNewSelectionAttributeObjects(typeValuesList, newAttrDefContainer) {
    const newSelectionAttributeObjects = []
    const selectionAttributes = typeValuesList.reduce((list, typeValue) => {
      return list.concat(
        typeValue.attributes.filter(
          ({ pred }) => newAttrDefContainer.get(pred).valueType === 'selection'
        )
      )
    }, [])
    for (const { pred, obj } of selectionAttributes) {
      if (this.#attributeDefinitionContainer.get(pred)) {
        if (
          !this.#attributeDefinitionContainer
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

  #moveEntities() {
    const command = this.#commander.factory.moveEntitiesToSelectedSpanCommand(
      this.#itemsWillBeCutAndPaste
    )
    this.#commander.invoke(command)
    this.#updateItems()
  }

  // Notify items that are cutting and items that are no longer cutting
  // in order to switch between highlighting entities that are cutting.
  #updateItems(newItems = []) {
    const oldItems = this.#cuttingItems.filter((i) => !newItems.includes(i))
    this.#items = newItems

    this.#eventEmitter.emit(
      'textae-event.clip-board.change',
      this.#cuttingItems,
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
  get #itemsWillBeCutAndPaste() {
    return this.#cuttingItems.filter(
      (i) => i.span.id !== this.#selectionModel.span.single?.id
    )
  }

  get #cuttingItems() {
    return this.hasCuttingItem ? this.#items : []
  }
}
