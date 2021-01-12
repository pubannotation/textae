import { diff } from 'jsondiffpatch'
import Pallet from '../Pallet'
import createPalletElement from '../Pallet/createPalletElement'
import bindAttributeEvent from './bindAttributeEvent'
import bindSelectionAttributeLabel from './bindAttributeEvent/bindSelectionAttributeLabel'
import createContentHtml from './createContentHtml'
import enableDrag from './enableDrag'

export default class EntityAndAttributePallet extends Pallet {
  constructor(
    editor,
    originalData,
    annotationData,
    typeContainer,
    selectionModelEntity
  ) {
    super(editor, createPalletElement('entity'))

    this._eventEmitter = editor.eventEmitter
    this._originalData = originalData
    this._annotationData = annotationData
    this._typeContainer = typeContainer
    this._selectionModelEntity = selectionModelEntity

    bindAttributeEvent(this, this._el, editor.eventEmitter)

    editor.eventEmitter
      .on('textae.typeDefinition.attribute.create', (pred) => {
        // Reload pallet when reverting deleted attribute.
        this.showAttribute(pred)
      })
      .on('textae.typeDefinition.attribute.change', (pred) => {
        // Reload pallet when reverting change attribute.
        this.showAttribute(pred)
      })
      .on('textae.typeDefinition.attribute.delete', () => {
        // Reload pallet when undo deleted attribute.
        this.showAttribute(null)
      })
      .on('textae.typeDefinition.attribute.move', () => {
        this.updateDisplay()
      })

    // Reload when instance addition / deletion is undo / redo.
    editor.eventEmitter
      .on('textae.annotationData.attribute.add', () => this.updateDisplay())
      .on('textae.annotationData.attribute.remove', () => this.updateDisplay())

    // Update selected entity label
    editor.eventEmitter.on('textae.selection.entity.change', () =>
      this.updateDisplay()
    )
  }

  updateDisplay() {
    super.updateDisplay()
    enableDrag(this._el, this)
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

  selectLeftTab() {
    // Ignore when type is seleceted.
    if (this._selectedPred) {
      // Select type when the first attribute selected.
      if (this._selectedIndex === 0) {
        this.showAttribute()
      } else {
        this.showAttribute(
          this._typeContainer.attributes[this._selectedIndex - 1].pred
        )
      }
    }
  }

  selectRightTab() {
    if (this._selectedPred) {
      // Ignore when the last attribute is selected.
      if (this._selectedIndex === this._typeContainer.attributes.length - 1) {
        return
      }

      this.showAttribute(
        this._typeContainer.attributes[this._selectedIndex + 1].pred
      )
    } else {
      // Select the first attribute when type selected.
      if (this._typeContainer.attributes.length) {
        this.showAttribute(this._typeContainer.attributes[0].pred)
      }
    }
  }

  get _selectedIndex() {
    return this._typeContainer.attributes.findIndex(
      (attribute) => attribute.pred === this._selectedPred
    )
  }

  get _content() {
    return createContentHtml(
      this._typeContainer,
      diff(
        this._originalData.configuration,
        Object.assign(
          {},
          this._originalData.configuration,
          this._annotationData.typeDefinition.config
        )
      ),
      this._selectedPred,
      this._selectionModelEntity,
      this._annotationData.typeDefinition.attribute
    )
  }

  get attrDef() {
    return this._typeContainer.findAttribute(this._selectedPred)
  }

  onSelectionAttributeLabelClick(onClick) {
    bindSelectionAttributeLabel(this._el, this, onClick)
  }
}
