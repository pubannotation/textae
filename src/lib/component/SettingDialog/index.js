import delegate from 'delegate'
import Dialog from '../Dialog'
import createContentHtml from './createContentHtml'
import reflectImmediately from './reflectImmediately'
import packageJson from '../../../../package.json'

export default class SettingDialog extends Dialog {
  constructor(editor, typeDefinition, displayInstance, view) {
    const contentHtml = createContentHtml({
      typeGapDisabled: !displayInstance.showInstance,
      typeGap: displayInstance.typeGap,
      lineHeight: view.getLineHeight(),
      typeDefinitionLocked: typeDefinition.isLock,
      version: packageJson.version
    })

    super('Setting', contentHtml, {
      label: 'OK'
    })

    // Reflects configuration changes in real time.
    reflectImmediately(super.el, editor, displayInstance, typeDefinition, view)

    // Observe enter key press
    delegate(super.el, `.textae-editor--dialog`, 'keyup', (e) => {
      if (e.keyCode === 13) {
        super.close()
      }
    })
  }
}
