import toButtonClass from '../toButtonClass'
import enable from '../enable'

export default function($control, buttonType) {
  const eventHandler = () => {
    $control.trigger(
      'textae.control.button.click',
      `textae.control.button.${buttonType.replace(/-/g, '_')}.click`
    )
  }
  $control
    .off('click', toButtonClass(buttonType))
    .on('click', toButtonClass(buttonType), eventHandler)
  enable($control, buttonType)
}
