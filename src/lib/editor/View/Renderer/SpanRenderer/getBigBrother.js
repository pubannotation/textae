// A big brother is brother node on a structure at rendered.
// There is no big brother if the span is first in a paragraph.
// Warning: parent is set at updateSpanTree, is not exists now.
export default function(span, topLevelSpans) {
  let index
  if (span.parent) {
    index = span.parent.children.indexOf(span)
    return index === 0 ? null : span.parent.children[index - 1]
  } else {
    index = topLevelSpans.indexOf(span)
    return index === 0 || topLevelSpans[index - 1].paragraph !== span.paragraph ? null : topLevelSpans[index - 1]
  }
}
