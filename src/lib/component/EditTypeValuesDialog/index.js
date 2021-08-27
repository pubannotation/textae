import delegate from 'delegate'
import PromiseDialog from '../PromiseDialog'
import getValues from './getValues'
import setSourceOfAutoComplete from '../setSourceOfAutoComplete'
import createContentHTML from './createContentHTML'
import SelectionAttributePallet from '../SelectionAttributePallet'
import EditNumericAttributeDialog from '../EditNumericAttributeDialog'
import EditStringAttributeDialog from '../EditStringAttributeDialog'
import mergedTypeValuesOf from './mergedTypeValuesOf'

export default class EditTypeValuesDialog extends PromiseDialog {
  constructor(
    editor,
    annotationType,
    entityContainer,
    attributeContainer,
    autocompletionWs,
    selectedItems,
    typeValuesPallet
  ) {
    const { typeName, attributes } = mergedTypeValuesOf(selectedItems)
    const contentHtml = createContentHTML(
      typeName,
      attributes,
      entityContainer,
      attributeContainer
    )

    super(
      `${annotationType} [${selectedItems
        .map(({ id }) => id)
        .join(',')}] Properties`,
      contentHtml,
      {
        maxWidth: 800
      },
      () => getValues(super.el)
    )

    // Observe edit an attribute button.
    delegate(
      super.el,
      '.textae-editor__edit-type-values-dialog__edit-attribute',
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
              .then(({ newObj, newLabel }) => {
                attributes[e.target.dataset.index].obj = newObj
                attributes[e.target.dataset.index].label = newLabel
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

    // Observe remove an attribute button.
    delegate(
      super.el,
      '.textae-editor__edit-type-values-dialog__remove-attribute',
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

    // Observe open pallet button.
    delegate(
      super.el,
      '.textae-editor__edit-type-values-dialog__open-pallet',
      'click',
      () => {
        super.close()
        typeValuesPallet.show()
      }
    )

    // Observe add an attribute button.
    delegate(
      super.el,
      '.textae-editor__edit-type-values-dialog__add-attribute',
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
    const typeNameElement = super.el.querySelector(
      '.textae-editor__edit-type-values-dialog__type-name'
    )
    const typeLabelElement = super.el.querySelector(
      '.textae-editor__edit-type-values-dialog__type-label'
    )
    setSourceOfAutoComplete(
      typeNameElement,
      typeLabelElement,
      autocompletionWs,
      (term) => entityContainer.findByLabel(term)
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
