import showLoadNoticeForEditableMode from './showLoadNoticeForEditableMode';

export default function(annotationData, editMode, writable, editable) {
    let showForEdit = (annotationData, multitrack, reject) => showLoadNoticeForEditableMode(annotationData, multitrack, reject, writable);

    if (editable) {
        annotationData.on('all.change', showForEdit);
    }
}
