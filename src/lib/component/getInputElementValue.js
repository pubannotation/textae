export default function(el, selector) {
  return (
    el.querySelector(`${selector} input`) &&
    el.querySelector(`${selector} input`).value
  )
}
