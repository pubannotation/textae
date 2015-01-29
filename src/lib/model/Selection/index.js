var clearAll = function(containerList) {
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
    relayEventsOfEachContainer = function(api) {
        _.each(api, function(container) {
            container
                .bind(container.name + '.change', function() {
                    api.trigger(container.name + '.change');
                })
                .bind(container.name + '.add', function(id) {
                    api.trigger(container.name + '.select', id);
                })
                .bind(container.name + '.remove', function(id) {
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
    var containerList = kinds.map(require('./IdContainer')),
        api = require('../../util/extendBindable')(
            containerList
            .reduce(function(a, b) {
                a[b.name] = b;
                return a;
            }, {})
        );

    relayEventsOfEachContainer(api);

    return extendUtilFunctions(containerList, api);
};
