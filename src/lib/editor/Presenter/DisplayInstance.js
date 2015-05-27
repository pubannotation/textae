import capitalize from 'capitalize';

const SEED = {
    instanceHide: 0,
    instanceShow: 2
};

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

function TypeGapCache() {
    let api = _.extend({}, SEED),
        set = (mode, val) => updateHash(api, mode, val);

    _.each(SEED, (val, key) => {
        api['set' + capitalize(key)] = (val) => set(key, val);
    });

    return api;
}

function updateHash(hash, key, val) {
    hash[key] = val;
    return val;
}
