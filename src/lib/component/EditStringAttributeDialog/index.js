import PromiseDialog from '../PromiseDialog'
import createContentHtml from './createContentHtml'
import setSourceOfAutoComplete from '../setSourceOfAutoComplete'

export default class EditStringAttributeDialog extends PromiseDialog {
  constructor(attribute, attrDef) {
    super(
      'Please edit string',
      createContentHtml({
        pred: attribute.pred,
        value: attribute.obj
      }),
      { height: 250 },
      '.textae-editor__edit-value-and-pred-dialog--value',
      () => {
        const input = super.el.querySelector(
          '.textae-editor__edit-value-and-pred-dialog--value'
        )

        return {
          newObj: input.value,
          newLabel: super.el.querySelector('span').innerText
        }
      }
    )

    setSourceOfAutoComplete(
      super.el.querySelector(
        '.textae-editor__edit-value-and-pred-dialog--value'
      ),
      super.el.querySelector('span'),
      attrDef.autocompletionWs,
      () => []
    )
  }
}
