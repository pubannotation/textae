var getPosition = function(span, startOfTextNodeAddSpan) {
    var startPos = span.begin - startOfTextNodeAddSpan,
      endPos = span.end - startOfTextNodeAddSpan;

    return {
      start: startPos,
      end: endPos
    };
  },
  validatePosition = function(textNode, start, end) {
    return 0 <= start && end <= textNode.length;
  },
  createRange = function(textNode, start, end) {
    var range = document.createRange();
    range.setStart(textNode, start);
    range.setEnd(textNode, end);
    return range;
  },
  createSpanRange = function(textNode, startOfTextNodeAddSpan, span) {
    var position = getPosition(span, startOfTextNodeAddSpan);

    if (!validatePosition(textNode, position.start, position.end)) {
      throw new Error('oh my god! I cannot render this span. ' + span.toStringOnlyThis() + ', textNode ' + textNode.textContent);
    }

    return createRange(textNode, position.start, position.end);
  };

// Create the Range to a new span add
module.exports = createSpanRange;
