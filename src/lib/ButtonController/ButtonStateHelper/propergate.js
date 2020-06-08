export default function(buttonEnableStates, buttonTransitStates, pushButtons) {
  buttonEnableStates.propagate()
  buttonTransitStates.propagate()
  pushButtons.propagate()
}
