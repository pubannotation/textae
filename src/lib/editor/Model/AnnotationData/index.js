var setNewData = require('./setNewData'),
    toJson = require('./toJson'),
    Container = require('./Container'),
    clearAnnotationData = function(dataStore) {
        dataStore.span.clear();
        dataStore.entity.clear();
        dataStore.relation.clear();
        dataStore.modification.clear();
        dataStore.paragraph.clear();
    },
    AnntationData = function(editor) {
        var originalData,
            dataStore = new Container(editor);

        return _.extend(dataStore, {
            reset: function(annotation) {
                try {
                    clearAnnotationData(dataStore);

                    if (!annotation.text) throw "read failed.";

                    var result = setNewData(dataStore, annotation);

                    originalData = annotation;

                    dataStore.emit('paragraph.change', dataStore.paragraph.all());

                    dataStore.emit('all.change', dataStore, result.multitrack, result.rejects);

                    return result.rejects;
                } catch (error) {
                    console.error(error, error.stack);
                }
            },
            toJson: function() {
                return JSON.stringify(toJson(originalData, dataStore));
            },
            getModificationOf: function(objectId) {
                return dataStore.modification.all()
                    .filter(function(m) {
                        return m.obj === objectId;
                    });
            }
        });
    };

module.exports = AnntationData;
