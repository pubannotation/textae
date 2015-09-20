import * as changeView from './changeView';
import showLoadNoticeForEditableMode from './showLoadNoticeForEditableMode';
import updateWritable from './updateWritable';

export default function(annotationData, editMode, writable, mode) {
    annotationData
        .on('all.change', (annotationData, multitrack, reject) => updateWritable(multitrack, reject, writable));

    let editable = mode === 'edit';
    if (editable) {
        let showForEdit = (annotationData, multitrack, reject) => showLoadNoticeForEditableMode(multitrack);

        annotationData
            .on('all.change', showForEdit)
            .on('all.change', (annotationData) => changeView.forEditable(editMode, annotationData));
    } else {
        annotationData
            .on('all.change', (annotationData) => changeView.forView(editMode, annotationData));
    }
}
