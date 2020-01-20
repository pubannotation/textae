import PromiseDialog from '../PromiseDialog'
import createContentHtml from './createContentHtml'

export default class extends PromiseDialog {
  constructor(attrDef, attribute) {
    super(
      'Please enter new values',
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

        return { newObj: input.value }
      }
    )
  }
}
