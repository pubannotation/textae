// A parameter can be spesified by object like { 'buttonType1': true, 'buttonType2': false }.
export default function (el, buttonEnables) {
  for (const button of el.querySelectorAll('.textae-control-icon')) {
    const { buttonType } = button.dataset

    if (buttonEnables[buttonType] === true) {
      button.classList.remove('textae-control-icon--disabled')
    } else {
      button.classList.add('textae-control-icon--disabled')
    }
  }
}
