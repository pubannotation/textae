import handle from "./handle"
import KeyApiMap from "./KeyApiMap"
import IconApiMap from "./IconApiMap"
import PalletApiMap from "./PalletApiMap"

export default function(
  command,
  presenter,
  daoHandler,
  buttonController,
  view,
  updateLineHeight
) {
  const keyApiMap = new KeyApiMap(command, presenter, daoHandler)
  const iconApiMap = new IconApiMap(command, presenter, daoHandler, buttonController, updateLineHeight)
  const palletApiMap = new PalletApiMap(daoHandler)

  // Update APIs
  return {
    handleKeyInput: (key, value) => handle(keyApiMap, key, value),
    handleButtonClick: (key, value) => handle(iconApiMap, key, value),
    handlePalletClick: (key, value) => handle(palletApiMap, key, value),
    redraw: () => {
      view.updateDisplay()
    },
    // To trigger button state update events on init.
    // Because an inline annotation is readed before a binding the control.
    updateButtons: buttonController.buttonStateHelper.propagate
  }
}
