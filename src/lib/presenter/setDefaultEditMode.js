var setViewMode = function(editMode, mode) {
        if (editMode['to' + mode]) {
            editMode['to' + mode]();
        }
    },
    setDefaultEditMode = function(editMode, isEditable, annotationData) {
        var prefix = isEditable ? '' : 'View';

        editMode.init();

        // Change view mode accoding to the annotation data.
        if (annotationData.relation.some() || annotationData.span.multiEntities().length > 0) {
            setViewMode(editMode, prefix + 'Instance');
        } else {
            setViewMode(editMode, prefix + 'Term');
        }
    };

module.exports = setDefaultEditMode;
