import delegate from 'delegate'
import Pallet from '../Pallet'
import bindAttributeEvent from './bindAttributeEvent'
import createContentHtml from './createContentHtml'
import enableDrag from './enableDrag'

export default class TypeValuesPallet extends Pallet {
  /**
   *
   * @param {import('../../Editor/AnnotationModel/TypeDefinition').default} typeDefinition
   * @param {import('../../Editor/AttributeDefinitionContainer').default} attributeInstanceContainer
   */
  constructor(
    editorHTMLElement,
    eventEmitter,
    typeDefinition,
    attributeInstanceContainer,
    definitionContainer,
    selectionModelEntity,
    commander,
    title,
    controlViewModel,
    mousePoint
  ) {
    super(editorHTMLElement, title, mousePoint)

    this._eventEmitter = eventEmitter
    this._typeDefinition = typeDefinition
    this._attributeInstanceContainer = attributeInstanceContainer
    this._definitionContainer = definitionContainer
    this._selectionModelItems = selectionModelEntity
    this._controlViewModel = controlViewModel

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
      .on('textae-event.original-data.configuration.reset', () =>
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

  show() {
    this._selectedPred = null
    super.show()
    enableDrag(this._el, this)
  }

  showAttribute(pred) {
    this._selectedPred = pred
    this.updateDisplay()
  }

  selectLeftAttributeTab() {
    // Ignore when type is seleceted.
    if (this._selectedPred) {
      // Select type when the first attribute selected.
      if (this._selectedIndex === 0) {
        this.showAttribute()
      } else {
        this.showAttribute(
          this._attributeDefinitions[this._selectedIndex - 1].pred
        )
      }
    }
  }

  selectRightAttributeTab() {
    if (this._selectedPred) {
      // Ignore when the last attribute is selected.
      if (this._selectedIndex === this._attributeDefinitions.length - 1) {
        return
      }

      this.showAttribute(
        this._attributeDefinitions[this._selectedIndex + 1].pred
      )
    } else {
      // Select the first attribute when type selected.
      if (this._attributeDefinitions.length) {
        this.showAttribute(this._attributeDefinitions[0].pred)
      }
    }
  }

  get _selectedIndex() {
    return this._attributeDefinitions.findIndex(
      (attribute) => attribute.pred === this._selectedPred
    )
  }

  get _content() {
    return createContentHtml(
      this._definitionContainer.pallet,
      this._controlViewModel.diffOfConfiguration,
      this._selectedPred,
      this._selectionModelItems,
      this._typeDefinition.attribute,
      this._attributeInstanceContainer.all,
      this._typeDefinition.isLock
    )
  }

  get attrDef() {
    return this._typeDefinition.attribute.get(this._selectedPred)
  }

  get _attributeDefinitions() {
    return this._typeDefinition.attribute.attributes
  }
}
