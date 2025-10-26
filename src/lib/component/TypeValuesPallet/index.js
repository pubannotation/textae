import delegate from 'delegate'

import Pallet from '../Pallet'
import bindAttributeEvent from './bindAttributeEvent'
import createContentHtml from './createContentHtml'
import enableDrag from './enableDrag'

export default class TypeValuesPallet extends Pallet {
  #typeDictionary
  #attributeInstanceContainer
  #definitionContainer
  #selectionModelItems
  #menuState
  #selectedPred

  /**
   *
   * @param {import('../../Editor/AnnotationModel/TypeDictionary').TypeDictionayr} typeDictionary
   * @param {import('../../Editor/AttributeDefinitionContainer').default} attributeInstanceContainer
   */
  constructor(
    editorHTMLElement,
    eventEmitter,
    typeDictionary,
    attributeInstanceContainer,
    definitionContainer,
    selectionModelEntity,
    commander,
    title,
    menuState,
    mousePoint
  ) {
    super(editorHTMLElement, title, mousePoint)

    this.#typeDictionary = typeDictionary
    this.#attributeInstanceContainer = attributeInstanceContainer
    this.#definitionContainer = definitionContainer
    this.#selectionModelItems = selectionModelEntity
    this.#menuState = menuState

    delegate(this._el, `.textae-editor__pallet__import-button`, 'click', () =>
      eventEmitter.emit('textae-event.pallet.import-button.click')
    )

    delegate(this._el, '.textae-editor__pallet__upload-button', 'click', () =>
      eventEmitter.emit('textae-event.pallet.upload-button.click')
    )

    bindAttributeEvent(this, this._el, commander, selectionModelEntity)

    eventEmitter
      .on('textae-event.type-definition.attribute.create', (pred) => {
        // Reload pallet when reverting deleted attribute.
        this.showAttribute(pred)
      })
      .on('textae-event.type-definition.attribute.change', (pred) => {
        // Reload pallet when reverting change attribute.
        this.showAttribute(pred)
      })
      .on('textae-event.type-definition.attribute.delete', () => {
        // Reload pallet when undo deleted attribute.
        this.showAttribute(null)
      })
      .on('textae-event.type-definition.attribute.move', () => {
        this.updateDisplay()
      })

    // Reload when instance addition / deletion is undo / redo.
    eventEmitter.on(
      'textae-event.annotation-data.events-observer.unsaved-change',
      () => this.updateDisplay()
    )

    // Update selected entity label
    eventEmitter.on('textae-event.selection.entity.change', () =>
      this.updateDisplay()
    )

    eventEmitter
      .on('textae-event.editor.unselect', () => this.hide()) // Close pallet when selecting other editor.
      .on('textae-event.resource.configuration.save', () =>
        this.updateDisplay()
      )
      .on(`textae-event.type-definition.lock`, () => this.updateDisplay())

    // Update the palette when undoing and redoing add entity and relation definition.
    eventEmitter
      .on('textae-event.type-definition.entity.change', () =>
        this.updateDisplay()
      )
      .on('textae-event.type-definition.entity.delete', () =>
        this.updateDisplay()
      )
      .on('textae-event.type-definition.entity.change-default', () =>
        this.updateDisplay()
      )
      .on('textae-event.type-definition.relation.change', () =>
        this.updateDisplay()
      )
      .on('textae-event.type-definition.relation.delete', () =>
        this.updateDisplay()
      )
      .on('textae-event.type-definition.relation.change-default', () =>
        this.updateDisplay()
      )
  }

  updateDisplay() {
    super.updateDisplay()
    enableDrag(this._el, this)
  }

  showPallet() {
    this.show()
  }

  hidePallet() {
    this.hide()
  }

  show() {
    this.#selectedPred = null
    super.show()
    enableDrag(this._el, this)
  }

  showAttribute(pred) {
    this.#selectedPred = pred
    this.updateDisplay()
  }

  selectLeftAttributeTab() {
    // Ignore when type is selected.
    if (this.#selectedPred) {
      // Select type when the first attribute selected.
      if (this.#selectedIndex === 0) {
        this.showAttribute()
      } else {
        this.showAttribute(
          this.#attributeDefinitions[this.#selectedIndex - 1].pred
        )
      }
    }
  }

  selectRightAttributeTab() {
    if (this.#selectedPred) {
      // Ignore when the last attribute is selected.
      if (this.#selectedIndex === this.#attributeDefinitions.length - 1) {
        return
      }

      this.showAttribute(
        this.#attributeDefinitions[this.#selectedIndex + 1].pred
      )
    } else {
      // Select the first attribute when type selected.
      if (this.#attributeDefinitions.length) {
        this.showAttribute(this.#attributeDefinitions[0].pred)
      }
    }
  }

  get #selectedIndex() {
    return this.#attributeDefinitions.findIndex(
      (attribute) => attribute.pred === this.#selectedPred
    )
  }

  get _content() {
    return createContentHtml(
      this.#definitionContainer.pallet,
      this.#menuState.diffOfConfiguration,
      this.#selectedPred,
      this.#selectionModelItems,
      this.#typeDictionary.attribute,
      this.#attributeInstanceContainer.all,
      this.#typeDictionary.isLock
    )
  }

  get attrDef() {
    return this.#typeDictionary.attribute.get(this.#selectedPred)
  }

  get #attributeDefinitions() {
    return this.#typeDictionary.attribute.attributes
  }
}
