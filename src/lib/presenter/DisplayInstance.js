var TypeGapCache = function() {
        var seed = {
                instanceHide: 0,
                instanceShow: 2
            },
            api = _.extend({}, seed),
            set = function(mode, val) {
                api[mode] = val;
                return val;
            },
            capitalize = require('../util/capitalize');

        _.each(seed, function(val, key) {
            api['set' + capitalize(key)] = _.partial(set, key);
        });

        return api;
    },
    DisplayInstance = function(typeGap, instanceMode) {
        var showInstance = true,
            typeGapCache = new TypeGapCache(),
            updateTypeGap = function() {
                if (showInstance) {
                    typeGap.set(typeGapCache.instanceShow);
                } else {
                    typeGap.set(typeGapCache.instanceHide);
                }
            },
            setShowInstance = function(val) {
                showInstance = val;
                updateTypeGap();
            };

        instanceMode
            .on('show', function(argument) {
                setShowInstance(true);
            })
            .on('hide', function(argument) {
                setShowInstance(false);
            });

        return {
            showInstance: function() {
                return showInstance;
            },
            changeTypeGap: function(val) {
                if (showInstance) {
                    typeGapCache.setInstanceShow(val);
                } else {
                    typeGapCache.setInstanceHide(val);
                }

                updateTypeGap();
            },
            getTypeGap:function () {
                return typeGap.get();
            },
            notifyNewInstance: function() {
                if (!showInstance) toastr.success("an instance is created behind.");
            }
        };
    };

module.exports = DisplayInstance;
