var AnnotationData = require('./AnnotationData');

module.exports = function(editor) {
    return {
        annotationData: new AnnotationData(editor),
        // A contaier of selection state.
        selectionModel: require('./Selection')(['span', 'entity', 'relation'])
    };
};
