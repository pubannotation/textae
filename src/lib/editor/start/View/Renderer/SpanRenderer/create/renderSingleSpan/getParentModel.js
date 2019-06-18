export default function(span) {
  if (span.parent) {
    // This span is first child of parent span.
    return span.parent
  } else {
    // The parentElement is paragraph unless parent.
    return span.paragraph
  }
}
