var setDefaultEditMode = require('./setDefaultEditMode');

module.exports = function(annotationData, editMode) {
    return {
        bindSetDefaultEditMode: function(mode) {
            var isEditable = mode === 'edit';

            annotationData.on('all.change', function(annotationData) {
                setDefaultEditMode(editMode, isEditable, annotationData);
            });
        }
    };
};
