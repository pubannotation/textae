import { diff } from 'jsondiffpatch'
import delegate from 'delegate'
import Pallet from '../Pallet'
import createPalletElement from '../Pallet/createPalletElement'
import bindUserEvents from '../Pallet/bindUserEvents'
import createContentHtml from './createContentHtml'

export default class extends Pallet {
  constructor(editor, originalData, typeDefinition) {
    super(editor, createPalletElement('entity'))

    this._originalData = originalData
    this._typeDefinition = typeDefinition
    this._typeContainer = typeDefinition.entity

    // Bind user events to the event emitter.
    const name = 'entity'
    bindUserEvents(this._el, editor.eventEmitter, name)

    delegate(
      this._el,
      '.textae-editor__type-pallet__attribute',
      'click',
      (e) => {
        this._selectedPred = e.target.dataset['attribute']
        this.updateDisplay()
        e.stopPropagation()
      }
    )

    delegate(
      this._el,
      '.textae-editor__type-pallet__create-predicate',
      'click',
      () =>
        editor.eventEmitter.emit(
          `textae.${name}Pallet.attribute.create-predicate-button.click`
        )
    )

    delegate(
      this._el,
      '.textae-editor__type-pallet__edit-predicate',
      'click',
      () =>
        editor.eventEmitter.emit(
          `textae.${name}Pallet.attribute.edit-predicate-button.click`,
          this._attrDef
        )
    )

    // Bind the mousedown event to keep the button out of focus.
    delegate(
      this._el,
      '.textae-editor__type-pallet__delete-predicate',
      'mousedown',
      (e) => {
        e.preventDefault()
        editor.eventEmitter.emit(
          `textae.${name}Pallet.attribute.delete-predicate-button.click`,
          this._attrDef
        )
      }
    )

    delegate(
      this._el,
      '.textae-editor__type-pallet__add-attribute-value-button',
      'click',
      () =>
        editor.eventEmitter.emit(
          `textae.${name}Pallet.attribute.add-value-button.click`,
          this._attrDef
        )
    )

    delegate(
      this._el,
      '.textae-editor__type-pallet__edit-value',
      'click',
      (e) =>
        editor.eventEmitter.emit(
          `textae.${name}Pallet.attribute.edit-value-button.click`,
          this._attrDef,
          e.target.dataset.index
        )
    )

    delegate(
      this._el,
      '.textae-editor__type-pallet__remove-value',
      'click',
      (e) =>
        editor.eventEmitter.emit(
          `textae.${name}Pallet.attribute.remove-value-button.click`,
          this._attrDef,
          e.target.dataset.index
        )
    )

    editor.eventEmitter
      .on('textae.typeDefinition.entity.attributeDefinition.create', (pred) => {
        this._selectedPred = pred
        // Reload pallet when reverting deleted attribute.
        this.updateDisplay()
      })
      .on('textae.typeDefinition.entity.attributeDefinition.change', (pred) => {
        this._selectedPred = pred
        // Reload pallet when reverting change attribute.
        this.updateDisplay()
      })
      .on('textae.typeDefinition.entity.attributeDefinition.delete', () => {
        this._selectedPred = null
        // Reload pallet when undo deleted attribute.
        this.updateDisplay()
      })

    // Reload when instance addition / deletion is undo / redo.
    editor.eventEmitter
      .on('textae.annotationData.attribute.add', () => this.updateDisplay())
      .on('textae.annotationData.attribute.remove', () => this.updateDisplay())
  }

  show(point) {
    this._selectedPred = null
    super.show(point)
  }

  get _content() {
    return createContentHtml(
      this._typeContainer,
      diff(
        this._originalData.configuration,
        Object.assign(
          {},
          this._originalData.configuration,
          this._typeDefinition.config
        )
      ),
      this._selectedPred
    )
  }

  get _attrDef() {
    return this._typeContainer.attributes.find(
      (a) => a.pred === this._selectedPred
    )
  }
}
