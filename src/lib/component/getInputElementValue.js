export default function (el, selector) {
  return (
    el.querySelector(`input${selector}`) &&
    el.querySelector(`input${selector}`).value
  )
}
