export default function (editor, element, className) {
  console.assert(element, 'element MUST exists.')

  const all = editor[0].querySelectorAll(`.${className}`)
  const index = Array.from(all).indexOf(element)

  if (all.length - index > 1) {
    return all[index + 1]
  }

  return null
}
