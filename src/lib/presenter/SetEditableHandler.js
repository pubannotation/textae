var setDefaultEditMode = require('./setDefaultEditMode');

module.exports = function(annotationData, editMode) {
    return {
        bindSetDefaultEditMode: function(mode) {
            var isEditable = mode === 'edit';

            annotationData.bind('all.change', function(annotationData) {
                setDefaultEditMode(editMode, isEditable, annotationData);
            });
        }
    };
};
