import TypeGapCache from './TypeGapCache';

export default function(typeGap, instanceMode) {
    let showInstance = true,
        typeGapCache = new TypeGapCache(),
        setShowInstance = function(val) {
            showInstance = val;
            updateTypeGap(showInstance, typeGap, typeGapCache);
        };

    instanceMode
        .on('show', function(argument) {
            setShowInstance(true);
        })
        .on('hide', function(argument) {
            setShowInstance(false);
        });

    return {
        showInstance: () => showInstance,
        changeTypeGap: (val) => {
            if (showInstance) {
                typeGapCache.setInstanceShow(val);
            } else {
                typeGapCache.setInstanceHide(val);
            }

            updateTypeGap();
        },
        getTypeGap: () => typeGap(),
        notifyNewInstance: () => {
            if (!showInstance) toastr.success("an instance is created behind.");
        }
    };
}

function updateTypeGap (showInstance, typeGap, typeGapCache) {
    if (showInstance) {
        typeGap.set(typeGapCache.instanceShow);
    } else {
        typeGap.set(typeGapCache.instanceHide);
    }
}
