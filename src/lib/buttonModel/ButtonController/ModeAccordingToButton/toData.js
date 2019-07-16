export default function(button) {
  return {
    buttonName: button.name,
    state: button.value()
  }
}
