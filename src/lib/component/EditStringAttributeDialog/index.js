import PromiseDialog from '../PromiseDialog'
import createContentHtml from './createContentHtml'

export default class extends PromiseDialog {
  constructor(attribute) {
    super(
      'Please enter new values',
      createContentHtml({
        pred: attribute.pred,
        value: attribute.obj
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
