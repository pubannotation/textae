import createSpanElement from './createSpanElement';
import createSpanRange from './createSpanRange';

export default function(span, bigBrother) {
    let targetRange = cerateRangeToSpan(span, bigBrother),
        spanElement = createSpanElement(span);

    targetRange.surroundContents(spanElement);
}

// Get the Range to that new span tag insert.
// This function works well when no child span is rendered.
function cerateRangeToSpan(span, bigBrother) {
    let targetTextNode,
        startOfTextNode;

    // The parent of the bigBrother is same with of span, which is a span or the root of spanTree.
    if (bigBrother) {
        // The target text arrounded by span is in a textNode after the bigBrother if bigBrother exists.
        [targetTextNode, startOfTextNode] = getTextNodeFromBigBrother(bigBrother);
    } else {
        // The target text arrounded by span is the first child of parent unless bigBrother exists.
        [targetTextNode, startOfTextNode] = getTextNodeFromParent(span);
    }

    if (!targetTextNode)
        throw new Error('The textNode on to create a span is not found. ' + span.toStringOnlyThis());

    return createSpanRange(targetTextNode, startOfTextNode, span);
}

function getTextNodeFromBigBrother(bigBrother) {
    return [
        document.querySelector('#' + bigBrother.id).nextSibling,
        bigBrother.end
    ];
}

function getTextNodeFromParent(span) {
    let parentModel = getParentModel(span);

    return [
        document.querySelector('#' + parentModel.id).firstChild,
        parentModel.begin
    ];
}

function getParentModel(span) {
    if (span.parent) {
        // This span is first child of parent span.
        return span.parent;
    } else {
        // The parentElement is paragraph unless parent.
        return span.paragraph;
    }
}
