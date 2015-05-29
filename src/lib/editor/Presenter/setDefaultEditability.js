import setDefaultView from './setDefaultView';
import showLoadNoticeForEditableMode from './showLoadNoticeForEditableMode';

export default function(annotationData, editMode, writable, mode) {
    let editable = mode !== 'view';
    annotationData.on('all.change', (annotationData) => setDefaultView(
        editMode,
        annotationData,
        editable
    ));

    let showForEdit = (annotationData, multitrack, reject) => showLoadNoticeForEditableMode(annotationData, multitrack, reject, writable);
    if (editable) {
        annotationData.on('all.change', showForEdit);
    }
}
