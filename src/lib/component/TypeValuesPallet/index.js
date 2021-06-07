import { diff } from 'jsondiffpatch'
import Pallet from '../Pallet'
import bindAttributeEvent from './bindAttributeEvent'
import createContentHtml from './createContentHtml'
import enableDrag from './enableDrag'

export default class TypeValuesPallet extends Pallet {
  constructor(
    editor,
    originalData,
    annotationData,
    definitionContainer,
    selectionModelEntity,
    commander,
    title
  ) {
    super(editor, 'entity', title)

    this._eventEmitter = editor.eventEmitter
    this._originalData = originalData
    this._annotationData = annotationData
    this._definitionContainer = definitionContainer
    this._selectionModelItems = selectionModelEntity

    bindAttributeEvent(this, this._el, commander, selectionModelEntity)

    editor.eventEmitter
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
    editor.eventEmitter
      .on('textae-event.annotation-data.attribute.add', () =>
        this.updateDisplay()
      )
      .on('textae-event.annotation-data.attribute.remove', () =>
        this.updateDisplay()
      )

    // Update selected entity label
    editor.eventEmitter.on('textae-event.selection.entity.change', () =>
      this.updateDisplay()
    )

    editor.eventEmitter
      .on('textae-event.editor.unselect', () => this.hide()) // Close pallet when selecting other editor.
      .on('textae-event.history.change', () => this.updateDisplay()) // Update save config button when changing history and savigng configuration.
      .on('textae-event.orginal-data.configuration.reset', () =>
        this.updateDisplay()
      )
      .on(`textae-event.type-definition.lock`, () => this.updateDisplay())
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
        this.showAttribute(this._attributes[this._selectedIndex - 1].pred)
      }
    }
  }

  selectRightTab() {
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
    console.log(
      '_content',
      this._originalData.configuration,
      this._annotationData.typeDefinition.config
    )
    return createContentHtml(
      this._definitionContainer.pallet,
      diff(this._originalData.configuration, {
        ...this._originalData.configuration,
        ...this._annotationData.typeDefinition.config
      }),
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
