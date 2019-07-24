export default function(typeLabel) {
  return Array.prototype.reduce.call(
    typeLabel.querySelectorAll('.textae-editor__attribute'),
    (carry, attribute) => {
      return carry + attribute.outerHTML
    },
    ''
  )
}
