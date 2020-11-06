// Since the style is specified by [disabled = "disabled"], set the attribute to disabled without using the disable property.
export default function (dom, enable) {
  if (enable) {
    dom.removeAttribute('disabled')
  } else {
    dom.setAttribute('disabled', 'disabled')
  }
}
