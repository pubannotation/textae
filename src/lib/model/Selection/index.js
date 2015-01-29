var IdContainer = require('./IdContainer'),
    extendBindable = require('../../util/extendBindable'),
    clearAll = function(containerList) {
        _.each(containerList, function(container) {
            container.clear();
        });
    },
    someAll = function(containerList) {
        return containerList
            .map(function(container) {
                return container.some();
            })
            .reduce(function(a, b) {
                return a || b;
            });

    },
    relayEventsOfEachContainer = function(api, containerList) {
        _.each(containerList, function(container) {
            container
                .on(container.name + '.change', function() {
                    api.trigger(container.name + '.change');
                })
                .on(container.name + '.add', function(id) {
                    api.trigger(container.name + '.select', id);
                })
                .on(container.name + '.remove', function(id) {
                    api.trigger(container.name + '.deselect', id);
                });
        });
    },
    extendUtilFunctions = function(containerList, api) {
        return _.extend(api, {
            clear: _.partial(clearAll, containerList),
            some: _.partial(someAll, containerList)
        });
    };

module.exports = function(kinds) {
    var containerList = kinds.map(IdContainer),
        hash = containerList
        .reduce(function(a, b) {
            a[b.name] = b;
            return a;
        }, {}),
        api = extendBindable(hash);

    relayEventsOfEachContainer(api, containerList);

    return extendUtilFunctions(containerList, api);
};
