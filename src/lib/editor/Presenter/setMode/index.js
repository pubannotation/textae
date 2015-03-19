import setDefaultView from './setDefaultView';

export default function(annotationData, editMode, mode) {
    let isEditable = mode === 'edit';

    editMode.init(isEditable);
    annotationData.on('all.change', annotationData => setDefaultView(
        editMode,
        annotationData
    ));
}
