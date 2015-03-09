const CONFIRM_DISCARD_CHANGE_MESSAGE = 'There is a change that has not been saved. If you procceed now, you will lose it.';

import DataAccessObject from './component/DataAccessObject';
import editingState from './editingState';

// model manages data objects.
var Model = require('./Model'),
    // The history of command that providing undo and redo.
    History = require('./History'),
    SpanConfig = require('./SpanConfig'),
    Command = require('./Command'),
    ButtonController = require('./ButtonController'),
    TypeContainer = require('./TypeContainer'),
    View = require('./View'),
    Presenter = require('./presenter/Presenter'),
    Controller = require('./Controller'),
    getParams = require('./getParams'),
    setTypeConfig = function(typeContainer, config) {
        typeContainer.setDefinedEntityTypes(config ? config['entity types'] : []);
        typeContainer.setDefinedRelationTypes(config ? config['relation types'] : []);

        if (config && config.css !== undefined) {
            $('#css_area').html('<link rel="stylesheet" href="' + config.css + '"/>');
        }

        return config;
    },
    handle = function(map, key, value) {
        if (map[key]) map[key](value);
    },
    StatusBar = require('./component/StatusBar'),
    getStatusBar = function(editor, status_bar) {
        if (status_bar === 'on')
            return new StatusBar(editor);
        return {
            status: function() {}
        };
    },
    Observable = require("observ"),
    ajaxAccessor = require('./util/ajaxAccessor');

module.exports = function() {
    var self = this,
        model = new Model(this),
        history = new History(),
        spanConfig = new SpanConfig(),
        // Users can edit model only via commands.
        command = new Command(this, model, history),
        clipBoard = {
            // clipBoard has entity type.
            clipBoard: []
        },
        buttonController = new ButtonController(this, model, clipBoard),
        typeGap = new Observable(-1),
        typeContainer = new TypeContainer(model),
        view = new View(this, model, buttonController, typeGap, typeContainer),
        presenter = new Presenter(
            this,
            model,
            view,
            command,
            spanConfig,
            clipBoard,
            buttonController,
            typeGap,
            typeContainer
        ),
        //handle user input event.
        controller = new Controller(this, presenter, view),
        setSpanAndTypeConfig = function(config) {
            spanConfig.set(config);
            setTypeConfig(typeContainer, config);
        },
        setConfigInAnnotation = function(annotation) {
            spanConfig.reset();
            setSpanAndTypeConfig(annotation.config);

            if (!annotation.config) {
                return 'no config';
            }
        },
        resetData = model.annotationData.reset,
        setConfigFromServer = function(config, annotation) {
            spanConfig.reset();

            if (typeof config === 'string') {
                ajaxAccessor
                    .getAsync(config,
                        function(configFromServer) {
                            setSpanAndTypeConfig(configFromServer);
                            resetData(annotation);
                        },
                        function() {
                            alert('could not read the span configuration from the location you specified.: ' + config);
                        }
                    );
            } else {
                resetData(annotation);
            }
        },
        setAnnotation = function(config, annotation) {
            var ret = setConfigInAnnotation(annotation);
            if (ret === 'no config') {
                setConfigFromServer(config, annotation);
            } else {
                resetData(annotation);
            }
        },
        loadAnnotation = function(statusBar, params, dataAccessObject) {
            var annotation = params.annotation;
            if (annotation) {
                if (annotation.inlineAnnotation) {
                    // Set an inline annotation.
                    setAnnotation(params.config, JSON.parse(annotation.inlineAnnotation));
                    statusBar.status('inline');
                } else if (annotation.url) {
                    // Load an annotation from server.
                    dataAccessObject.getAnnotationFromServer(annotation.url);
                }
            }
        },
        dataAccessObject = new DataAccessObject(self, CONFIRM_DISCARD_CHANGE_MESSAGE);

    editingState(
        model.annotationData,
        history,
        buttonController.buttonStateHelper,
        CONFIRM_DISCARD_CHANGE_MESSAGE,
        dataAccessObject
    );

    // public funcitons of editor
    this.api = function(editor) {
        var updateAPIs = function(dataAccessObject) {
                var showAccess = function() {
                        dataAccessObject.showAccess(history.hasAnythingToSave());
                    },
                    showSave = function() {
                        dataAccessObject.showSave(model.annotationData.toJson());
                    },
                    keyApiMap = {
                        'A': command.redo,
                        'B': presenter.event.toggleDetectBoundaryMode,
                        'C': presenter.event.copyEntities,
                        'D': presenter.event.removeSelectedElements,
                        'DEL': presenter.event.removeSelectedElements,
                        'E': presenter.event.createEntity,
                        'F': presenter.event.toggleRelationEditMode,
                        'I': showAccess,
                        'M': presenter.event.toggleRelationEditMode,
                        'Q': presenter.event.showPallet,
                        'R': presenter.event.replicate,
                        'S': presenter.event.speculation,
                        'U': showSave,
                        'V': presenter.event.pasteEntities,
                        'W': presenter.event.newLabel,
                        'X': presenter.event.negation,
                        'Y': command.redo,
                        'Z': command.undo,
                        'ESC': presenter.event.cancelSelect,
                        'LEFT': presenter.event.selectLeftSpan,
                        'RIGHT': presenter.event.selectRightSpan,
                    },
                    iconApiMap = {
                        'textae.control.button.read.click': showAccess,
                        'textae.control.button.write.click': showSave,
                        'textae.control.button.undo.click': command.undo,
                        'textae.control.button.redo.click': command.redo,
                        'textae.control.button.replicate.click': presenter.event.replicate,
                        'textae.control.button.replicate_auto.click': buttonController.modeAccordingToButton['replicate-auto'].toggle,
                        'textae.control.button.boundary_detection.click': presenter.event.toggleDetectBoundaryMode,
                        'textae.control.button.relation_edit_mode.click': presenter.event.toggleRelationEditMode,
                        'textae.control.button.entity.click': presenter.event.createEntity,
                        'textae.control.button.change_label.click': presenter.event.newLabel,
                        'textae.control.button.pallet.click': presenter.event.showPallet,
                        'textae.control.button.negation.click': presenter.event.negation,
                        'textae.control.button.speculation.click': presenter.event.speculation,
                        'textae.control.button.delete.click': presenter.event.removeSelectedElements,
                        'textae.control.button.copy.click': presenter.event.copyEntities,
                        'textae.control.button.paste.click': presenter.event.pasteEntities,
                        'textae.control.button.setting.click': presenter.event.showSettingDialog
                    };

                // Update APIs
                editor.api = {
                    handleKeyInput: _.partial(handle, keyApiMap),
                    handleButtonClick: _.partial(handle, iconApiMap),
                    redraw: function() {
                        view.updateDisplay();
                    }
                };
            },
            start = function start(editor) {
                var params = getParams(editor);

                view.init();
                controller.init();
                presenter.init();

                var statusBar = getStatusBar(editor, params.status_bar);

                dataAccessObject
                    .on('load', function(data) {
                        setAnnotation(params.config, data.annotation);
                        statusBar.status(data.source);
                    });

                presenter.setMode(params.mode);

                loadAnnotation(statusBar, params, dataAccessObject);

                updateAPIs(dataAccessObject);
            };

        return {
            start: start
        };
    }(this);

    return this;
};
