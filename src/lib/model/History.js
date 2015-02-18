// histories of edit to undo and redo.
module.exports = function() {
    var lastSaveIndex = -1,
        lastEditIndex = -1,
        history = [],
        hasAnythingToUndo = function() {
            return lastEditIndex > -1;
        },
        hasAnythingToRedo = function() {
            return lastEditIndex < history.length - 1;
        },
        hasAnythingToSave = function() {
            return lastEditIndex != lastSaveIndex;
        },
        trigger = function() {
            api.trigger('change', {
                hasAnythingToSave: hasAnythingToSave(),
                hasAnythingToUndo: hasAnythingToUndo(),
                hasAnythingToRedo: hasAnythingToRedo()
            });
        };

    var api = require('../util/extendBindable')({
        reset: function() {
            lastSaveIndex = -1;
            lastEditIndex = -1;
            history = [];
            trigger();
        },
        push: function(commands) {
            history.splice(lastEditIndex + 1, history.length - lastEditIndex, commands);
            lastEditIndex++;
            trigger();
        },
        next: function() {
            lastEditIndex++;
            trigger();
            return history[lastEditIndex];
        },
        prev: function() {
            var lastEdit = history[lastEditIndex];
            lastEditIndex--;
            trigger();
            return lastEdit;
        },
        saved: function() {
            lastSaveIndex = lastEditIndex;
            trigger();
        },
        hasAnythingToSave: hasAnythingToSave,
        hasAnythingToUndo: hasAnythingToUndo,
        hasAnythingToRedo: hasAnythingToRedo
    });

    return api;
};
