import delegate from 'delegate'
import Dialog from '../Dialog'
import reflectImmediately from './reflectImmediately'
import packageJson from '../../../../package.json'
import template from './template'

export default class SettingDialog extends Dialog {
  constructor(
    typeDictionary,
    typeGap,
    textBox,
    configuration,
    spanConfig,
    functionAvailability
  ) {
    const contentHtml = template({
      typeGapDisabled: !typeGap.show,
      typeGap: typeGap.value,
      lineHeight: textBox.lineHeight,
      autocompletionWs: typeDictionary.autocompletionWs,
      typeDictionaryLocked: typeDictionary.isLock,
      autosave: configuration.autosave,
      autoLineheight: configuration.autolineheight,
      boundaryDetection: configuration.boundarydetection,
      delimiterCharacters: spanConfig.delimiterCharacters,
      blankCharacters: spanConfig.blankCharacters,
      functionAvailability,
      version: packageJson.version
    })

    super('Setting', contentHtml)

    // Reflects configuration changes in real time.
    reflectImmediately(super.el, typeGap, typeDictionary, textBox)

    // Observe enter key press
    delegate(super.el, `.textae-editor__dialog`, 'keyup', (e) => {
      if (e.keyCode === 13) {
        super.close()
      }
    })
  }
}
