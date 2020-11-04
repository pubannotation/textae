export default function (element) {
  // 'save_to'
  const value = element.getAttribute('save_to')

  if (value) {
    return decodeURIComponent(value)
  }

  return ''
}
