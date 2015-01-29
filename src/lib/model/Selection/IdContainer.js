var EventEmitter = require('events').EventEmitter;

module.exports = function(kindName) {
    var emitter = new EventEmitter(),
        selected = {},
        triggerChange = function() {
            emitter.emit(kindName + '.change');
        },
        add = function(id) {
            selected[id] = id;
            emitter.emit(kindName + '.add', id);
            triggerChange();
        },
        all = function() {
            return _.toArray(selected);
        },
        has = function(id) {
            return _.contains(selected, id);
        },
        some = function() {
            return _.some(selected);
        },
        single = function() {
            var array = all();
            return array.length === 1 ? array[0] : null;
        },
        remove = function(id) {
            delete selected[id];
            emitter.emit(kindName + '.remove', id);
            triggerChange();
        },
        toggle = function(id) {
            if (has(id)) {
                remove(id);
            } else {
                add(id);
            }
        },
        clear = function() {
            if (!some()) return;

            _.each(all(), remove);
            selected = {};
            triggerChange();
        },
        mixin = {
            name: kindName,
            add: add,
            all: all,
            has: has,
            some: some,
            single: single,
            toggle: toggle,
            remove: remove,
            clear: clear
        },
        api = _.extend(emitter, mixin);

    return api;
};
