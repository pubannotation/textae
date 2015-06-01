export default function(domPositionCache, relationId) {
    let connect = domPositionCache.toConnect(relationId);

    addUiSelectClass(connect);
}

function addUiSelectClass(connect) {
    if (connect && connect.select) connect.select();
}
