import delegate from 'delegate'
import Pallet from '../Pallet'
import bindAttributeEvent from './bindAttributeEvent'
import createContentHtml from './createContentHtml'
import enableDrag from './enableDrag'

export default class TypeValuesPallet extends Pallet {
  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationData,
    definitionContainer,
    selectionModelEntity,
    commander,
    title,
    buttonController
  ) {
    super(editorHTMLElement, title)

    this._eventEmitter = eventEmitter
    this._annotationData = annotationData
    this._definitionContainer = definitionContainer
    this._selectionModelItems = selectionModelEntity
    this._buttonController = buttonController

    delegate(this._el, `.textae-editor__pallet__read-button`, 'click', () =>
      eventEmitter.emit('textae-event.pallet.read-button.click')
    )

    delegate(this._el, '.textae-editor__pallet__write-button', 'click', () =>
      eventEmitter.emit('textae-event.pallet.write-button.click')
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
    eventEmitter
      .on('textae-event.annotation-data.attribute.add', () =>
        this.updateDisplay()
      )
      .on('textae-event.annotation-data.attribute.remove', () =>
        this.updateDisplay()
      )

    // Update selected entity label
    eventEmitter.on('textae-event.selection.entity.change', () =>
      this.updateDisplay()
    )

    eventEmitter
      .on('textae-event.editor.unselect', () => this.hide()) // Close pallet when selecting other editor.
      .on('textae-event.history.change', () => this.updateDisplay()) // Update save config button when changing history and savigng configuration.
      .on('textae-event.orginal-data.configuration.reset', () =>
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
        this.showAttribute(this._attributes[this._selectedIndex - 1].pred)
      }
    }
  }

  selectRightAttributeTab() {
    if (this._selectedPred) {
      // Ignore when the last attribute is selected.
      if (this._selectedIndex === this._attributes.length - 1) {
        return
      }

      this.showAttribute(this._attributes[this._selectedIndex + 1].pred)
    } else {
      // Select the first attribute when type selected.
      if (this._attributes.length) {
        this.showAttribute(this._attributes[0].pred)
      }
    }
  }

  get _selectedIndex() {
    return this._attributes.findIndex(
      (attribute) => attribute.pred === this._selectedPred
    )
  }

  get _content() {
    return createContentHtml(
      this._definitionContainer.pallet,
      this._buttonController.diffOfConfiguration,
      this._selectedPred,
      this._selectionModelItems,
      this._annotationData.typeDefinition.attribute,
      this._annotationData.attribute.all,
      this._annotationData.typeDefinition.isLock
    )
  }

  get attrDef() {
    return this._annotationData.typeDefinition.attribute.get(this._selectedPred)
  }

  get _attributes() {
    return this._annotationData.typeDefinition.attribute.attributes
  }
}
