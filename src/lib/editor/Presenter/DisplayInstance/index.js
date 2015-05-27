import TypeGapCache from './TypeGapCache';

export default function(typeGap, editMode) {
    let showInstance = true,
        typeGapCache = new TypeGapCache();

    editMode
        .on('showInstance', function(argument) {
            showInstance = true;
            updateTypeGap(showInstance, typeGap, typeGapCache);
        })
        .on('hideInstance', function(argument) {
            showInstance = false;
            updateTypeGap(showInstance, typeGap, typeGapCache);
        });

    return {
        showInstance: () => showInstance,
        changeTypeGap: (val) => changeTypeGap(showInstance, typeGap, typeGapCache, val),
        getTypeGap: () => typeGap(),
        notifyNewInstance: () => {
            if (!showInstance) toastr.success("an instance is created behind.");
        }
    };
}

function changeTypeGap(showInstance, typeGap, typeGapCache, value) {
    if (showInstance) {
        typeGapCache.setInstanceShow(val);
    } else {
        typeGapCache.setInstanceHide(val);
    }

    updateTypeGap(showInstance, typeGap, typeGapCache);
}

function updateTypeGap(showInstance, typeGap, typeGapCache) {
    if (showInstance) {
        typeGap.set(typeGapCache.instanceShow);
    } else {
        typeGap.set(typeGapCache.instanceHide);
    }
}
