import toButtonClass from './toButtonClass'
import enable from './enable'
import disable from './disable'

const EVENT = 'click'

// A parameter can be spesified by object like { 'buttonType1': true, 'buttonType2': false }.
export default function($control, buttonList, buttonEnables) {
  Object.keys(buttonEnables)
    .filter((buttonType) => buttonList[buttonType])
    .forEach((buttonType) =>
      setButtonApearanceAndEventHandler(
        $control,
        buttonType,
        buttonEnables[buttonType]
      )
    )
}

function enableButton($control, buttonType) {
  const eventHandler = () => {
    $control.trigger(
      'textae.control.button.click',
      `textae.control.button.${buttonType.replace(/-/g, '_')}.click`
    )
  }

  $control
    .off(EVENT, toButtonClass(buttonType))
    .on(EVENT, toButtonClass(buttonType), eventHandler)

  enable($control, buttonType)
}

function disableButton($control, buttonType) {
  $control.off(EVENT, toButtonClass(buttonType))

  disable($control, buttonType)
}

function setButtonApearanceAndEventHandler($control, buttonType, enable) {
  // Set apearance and eventHandler to button.
  if (enable === true) {
    enableButton($control, buttonType)
  } else {
    disableButton($control, buttonType)
  }
}
