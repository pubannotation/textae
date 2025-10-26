import delegate from 'delegate'
import $ from 'jquery'
import packageJson from '../../../../package.json'
import Dialog from '../Dialog'
import bindAddCharacter from './bindAddCharacter'
import bindDeleteCharacter from './bindDeleteCharacter'
import reflectImmediately from './reflectImmediately'
import saveAutocompletionWs from './saveAutocompletionWs'
import saveSpanConfig from './saveSpanConfig'
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
      functionAvailability
    )

    // Observe enter key press
    delegate(super.el, `.textae-editor__dialog`, 'keyup', (e) => {
      if (e.keyCode === 13) {
        super.close()
      }
    })

    // Add delimiter/non-edge character row when '+' button click.
    bindAddCharacter(super.el)

    // Delete delimtier/non-edge character row when 'x' button click.
    bindDeleteCharacter(super.el)

    // Save SpanConfig when dialog close.
    $(this.el).on('dialogclose', () => {
      saveAutocompletionWs(super.el, typeDictionary)
      saveSpanConfig(super.el, spanConfig)
    })
  }
}
