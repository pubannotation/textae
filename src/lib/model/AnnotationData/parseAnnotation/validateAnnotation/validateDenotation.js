import validate from './validate';
import isBoundaryCrossingWithOtherSpans from './isBoundaryCrossingWithOtherSpans';

export default function(text, paragraph, denotations) {
    const resultHasLength = validate(
            denotations,
            hasLength
        ),
        resultInText = validate(
            resultHasLength.accept,
            isBeginAndEndIn,
            text
        ),
        resultInParagraph = validate(
            resultInText.accept,
            isInParagraph,
            paragraph
        ),
        resultIsNotCrossing = validate(
            resultInParagraph.accept, (denotation, opt, index, array) => {
                let others = array.slice(0, index).map(d => d.span),
                    isInvalid = isBoundaryCrossingWithOtherSpans(others, denotation.span);

                return !isInvalid;
            }
        );

    return {
        accept: resultIsNotCrossing.accept,
        reject: {
            hasLength: resultHasLength.reject,
            inText: resultInText.reject,
            inParagraph: resultInParagraph.reject,
            isNotCrossing: resultIsNotCrossing.reject
        },
        hasError: (
            resultHasLength.reject.length +
            resultInText.reject.length +
            resultInParagraph.reject.length +
            resultIsNotCrossing.reject.length
        ) !== 0
    };
}

function hasLength(denotation) {
    return denotation.span.end - denotation.span.begin > 0;
}

function isInText(boundary, text) {
    return 0 <= boundary && boundary <= text.length;
}

function isBeginAndEndIn(denotation, text) {
    return isInText(denotation.span.begin, text) &&
        isInText(denotation.span.end, text);
}

function isInParagraph(denotation, paragraph) {
    return paragraph.all()
        .filter(p => p.begin <= denotation.span.begin && denotation.span.end <= p.end)
        .length === 1;
}
