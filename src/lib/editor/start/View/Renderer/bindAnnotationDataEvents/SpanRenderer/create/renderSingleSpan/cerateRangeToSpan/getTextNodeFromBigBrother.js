export default function(bigBrother) {
  return [
    document.querySelector(`#${bigBrother.id}`).nextSibling,
    bigBrother.end
  ]
}
