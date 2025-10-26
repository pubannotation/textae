import EditNumericAttributeDialog from '../EditNumericAttributeDialog'
import EditStringAttributeDialog from '../EditStringAttributeDialog'
import SelectionAttributePallet from '../SelectionAttributePallet'
import getValues from './getValues'

export default class EditAttributeButtonHandler {
  #edtiorHTMLElement
  #attributeContainer
  #mousePoint
  #element
  #updateDisplay

  constructor(
    editorHTMLElement,
    attributeContainer,
    mousePoint,
    element,
    updateDisplay
  ) {
    this.#edtiorHTMLElement = editorHTMLElement
    this.#attributeContainer = attributeContainer
    this.#mousePoint = mousePoint
    this.#element = element
    this.#updateDisplay = updateDisplay
  }

  onClick(event) {
    const { pred } = event.target.dataset
    const attrDef = this.#attributeContainer.get(pred)
    const zIndex = parseInt(
      this.#element.closest('.textae-editor__dialog').style['z-index'],
      10
    )
    const { typeName, label, attributes } = getValues(this.#element)

    switch (attrDef.valueType) {
      case 'numeric':
        new EditNumericAttributeDialog(
          attrDef,
          attributes[event.target.dataset.index],
          [attributes[event.target.dataset.index]]
        )
          .open()
          .then(({ newObj }) => {
            attributes[event.target.dataset.index].obj = newObj
            this.#updateDisplay(typeName, label, attributes)
          })
        break
      case 'selection':
        new SelectionAttributePallet(this.#edtiorHTMLElement, this.#mousePoint)
          .show(attrDef, zIndex, event.target)
          .then((newObj) => {
            attributes[event.target.dataset.index].obj = newObj
            this.#updateDisplay(typeName, label, attributes)
          })
        break
      case 'string':
        new EditStringAttributeDialog(
          attrDef,
          attributes[event.target.dataset.index],
          [attributes[event.target.dataset.index]]
        )
          .open()
          .then(({ newObj, newLabel }) => {
            attributes[event.target.dataset.index].obj = newObj
            attributes[event.target.dataset.index].label = newLabel
            this.#updateDisplay(typeName, label, attributes)
          })
        break
      default:
        throw `${attrDef.valueType} is unknown attribute.`
    }
  }
}
