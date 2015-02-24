import validate from './validate';
import isContains from './isContains';

export default function(denotations, relations) {
    const resultRelationObj = validate(
            relations,
            isContains, {
                property: 'obj',
                dictionary: denotations
            }),
        resultRelationSubj = validate(
            resultRelationObj.accept,
            isContains, {
                property: 'subj',
                dictionary: denotations
            });

    return {
        accept: resultRelationSubj.accept,
        reject: {
            obj: resultRelationObj.reject,
            subj: resultRelationSubj.reject,
            hasError: (
                resultRelationObj.reject.length +
                resultRelationSubj.reject.length
            ) !== 0
        }
    };
}
