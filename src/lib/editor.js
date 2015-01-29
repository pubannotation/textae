// model manages data objects.
var Model = require('./model/Model'),
    // The history of command that providing undo and redo.
    History = require('./model/History'),
    SpanConfig = require('./SpanConfig'),
    Command = require('./command'),
    ButtonController = require('./view/ButtonController'),
    View = require('./view/View'),
    Presenter = require('./presenter/Presenter'),
    Controller = require('./Controller'),
    createDaoForEditor = require('./createDaoForEditor'),
    getParams = require('./getParams'),
    setTypeConfig = function(view, config) {
        view.typeContainer.setDefinedEntityTypes(config ? config['entity types'] : []);
        view.typeContainer.setDefinedRelationTypes(config ? config['relation types'] : []);

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
    ObservableValue = require('./util/ObservableValue'),
    ajaxAccessor = require('./util/ajaxAccessor');

module.exports = function() {
    var model = new Model(this),
        history = new History(),
        spanConfig = new SpanConfig(),
        // Users can edit model only via commands.
        command = new Command(this, model, history),
        clipBoard = {
            // clipBoard has entity type.
            clipBoard: []
        },
        buttonController = new ButtonController(this, model, clipBoard),
        typeGap = new ObservableValue(-1),
        view = new View(this, model, buttonController, typeGap.get),
        presenter = new Presenter(this, model, view, command, spanConfig, clipBoard, buttonController, typeGap),
        //handle user input event.
        controller = new Controller(this, history, presenter, view, buttonController.buttonStateHelper),
        setTypeConfigToView = _.partial(setTypeConfig, view),
        setSpanAndTypeConfig = function(config) {
            spanConfig.set(config);
            setTypeConfigToView(config);
        },
        setConfigInAnnotation = function(annotation) {
            spanConfig.reset();
            setSpanAndTypeConfig(annotation.config);

            if (!annotation.config) {
                return 'no config';
            }
        },
        resetData = function(annotation) {
            model.annotationData.reset(annotation);
            history.reset();
        },
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
        };

    typeGap.on('change', view.setTypeGap);

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
                        console.log(editor.editorId, 'redraw');
                        view.updateDisplay(typeGap.get());
                    }
                };
            },
            start = function start(editor) {
                var CONFIRM_DISCARD_CHANGE_MESSAGE = 'There is a change that has not been saved. If you procceed now, you will lose it.';
                var params = getParams(editor);

                view.init();
                controller.init(CONFIRM_DISCARD_CHANGE_MESSAGE);
                presenter.init();

                var statusBar = getStatusBar(editor, params.status_bar),
                    dataAccessObject = createDaoForEditor(
                        editor,
                        CONFIRM_DISCARD_CHANGE_MESSAGE,
                        history,
                        statusBar,
                        _.partial(setAnnotation, params.config)
                    );

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
