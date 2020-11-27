import PromiseDialog from '../PromiseDialog'
import createContentHtml from './createContentHtml'

export default class EditNumericAttributeDialog extends PromiseDialog {
  constructor(attrDef, attribute) {
    super(
      'Please edit number',
      createContentHtml({
        pred: attribute.pred,
        value: attribute.obj,
        min: attrDef.min,
        max: attrDef.max,
        step: attrDef.step
      }),
      {},
      '.textae-editor__edit-value-and-pred-dialog--value',
      () => {
        const input = super.el.querySelector(
          '.textae-editor__edit-value-and-pred-dialog--value'
        )

        // Numeric attribute obj value type must be Number type.
        return { newObj: parseFloat(input.value) }
      }
    )
  }
}
