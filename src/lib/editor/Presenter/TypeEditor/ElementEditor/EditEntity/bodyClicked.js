import getSelectionSnapShot from './getSelectionSnapShot';

export default function(cancelSelect, selectEnd, spanConfig) {
    let selection = window.getSelection();

    // No select
    if (selection.isCollapsed) {
        cancelSelect();
    } else {
        selectEnd.onText({
            spanConfig: spanConfig,
            selection: getSelectionSnapShot()
        });
    }
}
