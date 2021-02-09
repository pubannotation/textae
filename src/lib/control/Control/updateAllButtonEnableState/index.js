import updateButtons from './updateButtons'

// Buttons that always eanable.
const ALWAYS_ENABLES = {
  read: true,
  write: true,
  help: true
}

export default function (el, enableButtons) {
  // Make buttons in a enableButtons enabled, and other buttons in the buttonList disabled.
  const enables = { ...enableButtons, ...ALWAYS_ENABLES }
  // A function to enable/disable button.
  updateButtons(el, enables)
}
