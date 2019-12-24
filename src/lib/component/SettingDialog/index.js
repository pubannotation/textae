import delegate from 'delegate'
import getLineHeight from '../../editor/start/View/lineHeight/getLineHeight'
import Dialog from '../Dialog'
import createContentHtml from './createContentHtml'
import reflectImmediately from './reflectImmediately'

export default class extends Dialog {
  constructor(editor, typeDefinition, displayInstance) {
    const contentHtml = createContentHtml({
      typeGapDisabled: !displayInstance.showInstance,
      typeGap: displayInstance.typeGap,
      lineHeight: getLineHeight(editor[0]),
      typeDefinitionLocked: typeDefinition.isLock()
    })
    const okHandler = () => super.close()

    super('Setting', contentHtml, {
      buttons: {
        OK: okHandler
      }
    })

    // Reflects configuration changes in real time.
    reflectImmediately(super.el, editor, displayInstance, typeDefinition)

    // Observe enter key press
    delegate(super.el, `.textae-editor--dialog`, 'keyup', (e) => {
      if (e.keyCode === 13) {
        okHandler()
      }
    })
  }
}
