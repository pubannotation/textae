// A mixin for the separeted presentation by the observer pattern.
var bindable = function() {
    var callbacks = {};

    return {
        bind: function(event, callback) {
            if (!_.isFunction(callback)) throw new Error('Only a function is bindable!');

            callbacks[event] = callbacks[event] || [];
            callbacks[event].push(callback);
            return this;
        },
        unbind: function(event, callback) {
            if (!callbacks[event]) return this;

            callbacks[event] = _.reject(callbacks[event], function(existsCallback) {
                return existsCallback === callback;
            });
            return this;
        },
        trigger: function(event, data) {
            if (callbacks[event]) {
                callbacks[event].forEach(function(callback) {
                    callback(data);
                });
            }
            return data;
        }
    };
};

module.exports = function(obj) {
    return _.extend({}, obj, bindable());
};