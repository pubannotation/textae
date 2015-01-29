var EventEmitter = require('events').EventEmitter,
    IdContainer = require('./IdContainer'),
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
    relayEventsOfEachContainer = function(emitter, containerList) {
        _.each(containerList, function(container) {
            container
                .on(container.name + '.change', function() {
                    emitter.emit(container.name + '.change');
                })
                .on(container.name + '.add', function(id) {
                    emitter.emit(container.name + '.select', id);
                })
                .on(container.name + '.remove', function(id) {
                    emitter.emit(container.name + '.deselect', id);
                });
        });
    },
    extendUtilFunctions = function(api, containerList) {
        return _.extend(api, {
            clear: _.partial(clearAll, containerList),
            some: _.partial(someAll, containerList)
        });
    };

module.exports = function(kinds) {
    var emitter = new EventEmitter(),
        containerList = kinds.map(IdContainer),
        hash = containerList
        .reduce(function(a, b) {
            a[b.name] = b;
            return a;
        }, {}),
        api = _.extend(emitter, hash);

    relayEventsOfEachContainer(emitter, containerList);

    return extendUtilFunctions(api, containerList);
};
