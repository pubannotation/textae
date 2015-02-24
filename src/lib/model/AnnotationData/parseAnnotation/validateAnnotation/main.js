import validate from './validate';

export default function(text, paragraph, annotation) {
    const resultDenotationHasLength = validate(
            annotation.denotations,
            hasLength
        ),
        resultDenotationInText = validate(
            resultDenotationHasLength.accept,
            isBeginAndEndIn,
            text
        ),
        resultDenotationInParagraph = validate(
            resultDenotationInText.accept,
            isInParagraph,
            paragraph
        ),
        resultRelationObj = validate(
            annotation.relations,
            isContains, {
                property: 'obj',
                dictionary: resultDenotationInParagraph.accept
            }),
        resultRelationSubj = validate(
            resultRelationObj.accept,
            isContains, {
                property: 'subj',
                dictionary: resultDenotationInParagraph.accept
            }),
        resultModification = validate(
            annotation.modifications,
            isContains, {
                property: 'obj',
                dictionary: _.union(resultDenotationInParagraph.accept, resultRelationSubj.accept)
            });

    return {
        accept: {
            denotation: resultDenotationInParagraph.accept,
            relation: resultRelationSubj.accept,
            modification: resultModification.accept
        },
        reject: {
            denotationHasLength: resultDenotationHasLength.reject,
            denotationInText: resultDenotationInText.reject,
            denotationInParagraph: resultDenotationInParagraph.reject,
            relationObj: resultRelationObj.reject,
            relationSubj: resultRelationSubj.reject,
            modification: resultModification.reject,
            hasError: (resultDenotationHasLength.reject.length +
                resultDenotationInText.reject.length +
                resultDenotationInParagraph.reject.length +
                resultRelationObj.reject.length +
                resultRelationSubj.reject.length +
                resultModification.reject.length) !== 0
        }
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

function isContains(data, opt) {
    if (!opt.dictionary) return false;

    return opt.dictionary
        .filter(entry => entry.id === data[opt.property])
        .length === 1;
}
