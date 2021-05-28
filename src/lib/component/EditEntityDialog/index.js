import delegate from 'delegate'
import PromiseDialog from '../PromiseDialog'
import getValues from './getValues'
import setSourceOfAutoComplete from '../setSourceOfAutoComplete'
import createContentHTML from './createContentHTML'
import SelectionAttributePallet from '../SelectionAttributePallet'
import EditNumericAttributeDialog from '../EditNumericAttributeDialog'
import EditStringAttributeDialog from '../EditStringAttributeDialog'

export default class EditEntityDialog extends PromiseDialog {
  constructor(
    editor,
    entityContainer,
    attributeContainer,
    autocompletionWs,
    typeValues
  ) {
    const { typeName, attributes } = typeValues
    const contentHtml = createContentHTML(
      typeName,
      attributes,
      entityContainer,
      attributeContainer
    )

    super(
      'Please edit type and attributes',
      contentHtml,
      {
        minHeight: 300,
        width: 800
      },
      () => getValues(super.el)
    )

    // Observe edit an attributu button.
    delegate(
      super.el,
      '.textae-editor__edit-type-dialog__attribute__edit__value',
      'click',
      (e) => {
        const { pred } = e.target.dataset
        const attrDef = attributeContainer.get(pred)
        const zIndex = parseInt(
          super.el.closest('.textae-editor__dialog').style['z-index']
        )
        const { typeName, attributes } = getValues(super.el)

        switch (attrDef.valueType) {
          case 'numeric':
            new EditNumericAttributeDialog(
              attrDef,
              attributes[e.target.dataset.index]
            )
              .open()
              .then(({ newObj }) => {
                attributes[e.target.dataset.index].obj = newObj
                this._updateDisplay(
                  typeName,
                  attributes,
                  attributeContainer,
                  entityContainer
                )
              })
            break
          case 'selection':
            new SelectionAttributePallet(editor)
              .show(attrDef, zIndex, e.target)
              .then((newObj) => {
                attributes[e.target.dataset.index].obj = newObj
                this._updateDisplay(
                  typeName,
                  attributes,
                  attributeContainer,
                  entityContainer
                )
              })
            break
          case 'string':
            new EditStringAttributeDialog(
              attributes[e.target.dataset.index],
              attrDef
            )
              .open()
              .then(({ newObj }) => {
                attributes[e.target.dataset.index].obj = newObj
                this._updateDisplay(
                  typeName,
                  attributes,
                  attributeContainer,
                  entityContainer
                )
              })
            break
          default:
            throw `${attrDef.valueType} is unknown attribute.`
        }
      }
    )

    // Observe remove an attributu button.
    delegate(
      super.el,
      '.textae-editor__edit-type-dialog__attribute__remove__value',
      'click',
      (e) => {
        const { index } = e.target.dataset
        const indexOfAttribute = parseInt(index)
        const { typeName, attributes } = getValues(super.el)
        this._updateDisplay(
          typeName,
          attributes.filter((_, i) => i !== indexOfAttribute),
          attributeContainer,
          entityContainer
        )
      }
    )

    // Observe add an attributu button.
    delegate(
      super.el,
      '.textae-editor__edit-type-dialog__attribute__add',
      'click',
      (e) => {
        const { pred } = e.target.dataset
        const defaultValue = attributeContainer.get(pred).default

        const { typeName, attributes } = getValues(super.el)
        this._updateDisplay(
          typeName,
          attributes
            .concat({ pred, obj: defaultValue, id: '' })
            .sort((a, b) => attributeContainer.attributeCompareFunction(a, b)),
          attributeContainer,
          entityContainer
        )
      }
    )

    // Setup autocomplete
    const value = super.el.querySelector(
      '.textae-editor__edit-type-dialog__type__value__value'
    )
    const labelSpan = super.el.querySelector(
      '.textae-editor__edit-type-dialog__type__label__value'
    )
    setSourceOfAutoComplete(value, labelSpan, autocompletionWs, (term) =>
      entityContainer.findByLabel(term)
    )
  }

  _updateDisplay(typeName, attributes, attributeContainer, entityContainer) {
    const contentHtml = createContentHTML(
      typeName,
      attributes,
      entityContainer,
      attributeContainer
    )
    super.el.closest('.ui-dialog-content').innerHTML = contentHtml
  }
}
