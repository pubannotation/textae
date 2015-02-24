import domUtil from '../../../util/domUtil';
import createSpanRange from './createSpanRange';
import getFirstTextNode from './getFirstTextNode';

export default function(spanContainer, span) {
    return appendSpanElement(spanContainer, span);
}

function appendSpanElement(spanContainer, span) {
    getRangeToInsertSpanTag(spanContainer, span).surroundContents(createSpanElement(span));

    return span;
}

// Get the Range to that new span tag insert.
// This function works well when no child span is rendered.
function getRangeToInsertSpanTag(spanContainer, span) {
    // The parent of the bigBrother is same with span, which is a span or the root of spanTree.
    var bigBrother = spanContainer.getBigBrother(span, spanContainer.topLevel());
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
}

function getFirstTextNodeFromParagraph(paragraphId) {
    return getFirstTextNode($('#' + paragraphId));
}

function getFirstTextNodeFromSpan(spanId) {
    return getFirstTextNode(domUtil.selector.span.get(spanId));
}

function createSpanElement(span) {
    var element = document.createElement('span');
    element.setAttribute('id', span.id);
    element.setAttribute('title', span.id);
    element.setAttribute('class', 'textae-editor__span');
    return element;
}
