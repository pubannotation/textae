const allModificationClasses = 'textae-editor__negation textae-editor__speculation';

export default function(annotationData) {
    return {
        getClasses: _.partial(getClasses, annotationData),
        update: _.partial(update, annotationData)
    };
}

function getClasses(annotationData, objectId) {
    return annotationData.getModificationOf(objectId)
        .map(function(m) {
            return 'textae-editor__' + m.pred.toLowerCase();
        }).join(' ');
}

function update(annotationData, domElement, objectId) {
    domElement.removeClass(allModificationClasses);
    domElement.addClass(getClasses(annotationData, objectId));
}
