import validate from './validate';

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
        );

    return {
        accept: resultInParagraph.accept,
        reject: {
            hasLength: resultHasLength.reject,
            inText: resultInText.reject,
            inParagraph: resultInParagraph.reject
        },
        hasError: (
            resultHasLength.reject.length +
            resultInText.reject.length +
            resultInParagraph.reject.length
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
