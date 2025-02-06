import delegate from 'delegate'
import Dialog from '../Dialog'
import reflectImmediately from './reflectImmediately'
import packageJson from '../../../../package.json'
import template from './template'

export default class SettingDialog extends Dialog {
  constructor(
    eventEmitter,
    typeDictionary,
    typeGap,
    textBox,
    spanConfig,
    functionAvailability
  ) {
    const contentHtml = template({
      typeGapDisabled: !typeGap.show,
      typeGap: typeGap.value,
      lineHeight: textBox.lineHeight,
      autocompletionWs: typeDictionary.autocompletionWs,
      typeDictionaryLocked: typeDictionary.isLock,
      delimiterCharacters: spanConfig.delimiterCharacters,
      blankCharacters: spanConfig.blankCharacters,
      functionAvailability,
      version: packageJson.version
    })

    super('Setting', contentHtml)

    // Reflects configuration changes in real time.
    reflectImmediately(
      super.el,
      eventEmitter,
      typeGap,
      typeDictionary,
      textBox,
      spanConfig,
      functionAvailability
    )

    // Observe enter key press
    delegate(super.el, `.textae-editor__dialog`, 'keyup', (e) => {
      if (e.keyCode === 13) {
        super.close()
      }
    })
  }
}
