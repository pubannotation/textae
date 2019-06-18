export default function(textNode, offset) {
  return 0 <= offset.start && offset.end <= textNode.length
}
