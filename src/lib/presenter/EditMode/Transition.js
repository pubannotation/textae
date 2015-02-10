var resetView = function(typeEditor, selectionModel) {
        typeEditor.hideDialogs();
        selectionModel.clear();
    },
    Transition = function(typeEditor, selectionModel, viewMode, instanceEvent) {
        var api = {
                toTerm: function() {
                    resetView(typeEditor, selectionModel);

                    typeEditor.editEntity();
                    viewMode.setTerm();
                    viewMode.setEditable(true);

                    instanceEvent.emit('hide');
                },
                toInstance: function() {
                    resetView(typeEditor, selectionModel);

                    typeEditor.editEntity();
                    viewMode.setInstance();
                    viewMode.setEditable(true);

                    instanceEvent.emit('show');
                },
                toRelation: function() {
                    resetView(typeEditor, selectionModel);

                    typeEditor.editRelation();
                    viewMode.setRelation();
                    viewMode.setEditable(true);

                    instanceEvent.emit('show');
                },
                toViewTerm: function() {
                    resetView(typeEditor, selectionModel);

                    viewMode.setTerm();
                    viewMode.setEditable(false);

                    instanceEvent.emit('hide');
                },
                toViewInstance: function() {
                    resetView(typeEditor, selectionModel);

                    viewMode.setInstance();
                    viewMode.setEditable(false);

                    instanceEvent.emit('show');
                }
            };

        return api;
    };

module.exports = Transition;
