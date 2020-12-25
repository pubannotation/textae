// Since the style is specified by [disabled = "disabled"],
// set the attribute to disabled without using the disable property.
export default function (element, enable) {
  if (enable) {
    element.removeAttribute('disabled')
  } else {
    element.setAttribute('disabled', 'disabled')
  }
}
