var AnntationData = require('./AnntationData');

module.exports = function(editor) {
    return {
        annotationData: new AnntationData(editor),
        // A contaier of selection state.
        selectionModel: require('./Selection')(['span', 'entity', 'relation'])
    };
};
