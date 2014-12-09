var createSpanRange = require('./createSpanRange'),
  getFirstTextNode = require('./getFirstTextNode'),
  createSpanElement = function(span) {
    var element = document.createElement('span');
    element.setAttribute('id', span.id);
    element.setAttribute('title', span.id);
    element.setAttribute('class', 'textae-editor__span');
    return element;
  },
  RenderSingleSpan = function(editor) {
    var domUtil = require('../../util/DomUtil')(editor),
      getFirstTextNodeFromSpan = _.compose(getFirstTextNode, domUtil.selector.span.get),
      getFirstTextNodeFromParagraph = _.compose(getFirstTextNode, function(id) {
        return $('#' + id);
      }),
      // Get the Range to that new span tag insert.
      // This function works well when no child span is rendered.
      getRangeToInsertSpanTag = function(span) {
        // The parent of the bigBrother is same with span, which is a span or the root of spanTree.
        var bigBrother = span.getBigBrother();
        if (bigBrother) {
          // The target text arrounded by span is in a textNode after the bigBrother if bigBrother exists.
          return createSpanRange(document.getElementById(bigBrother.id).nextSibling, bigBrother.end, span);
        } else {
          // The target text arrounded by span is the first child of parent unless bigBrother exists.
          if (span.parent) {
            // The parent is span.
            // This span is first child of span.
            return createSpanRange(getFirstTextNodeFromSpan(span.parent.id), span.parent.begin, span);
          } else {
            // The parent is paragraph
            return createSpanRange(getFirstTextNodeFromParagraph(span.paragraph.id), span.paragraph.begin, span);
          }
        }
      },
      appendSpanElement = function(span, element) {
        getRangeToInsertSpanTag(span).surroundContents(element);

        return span;
      },
      renderSingleSpan = function(span) {
        return appendSpanElement(span, createSpanElement(span));
      };

    return renderSingleSpan;
  };

module.exports = RenderSingleSpan;
