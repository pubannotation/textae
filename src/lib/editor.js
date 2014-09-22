var SpanConfig = function() {
        var defaults = {
                "delimiter characters": [
                    " ",
                    ".",
                    "!",
                    "?",
                    ",",
                    ":",
                    ";",
                    "-",
                    "/",
                    "&",
                    "(",
                    ")",
                    "{",
                    "}",
                    "[",
                    "]",
                    "+",
                    "*",
                    "\\",
                    "\"",
                    "'",
                    "\n",
                    "–"
                ],
                "non-edge characters": [
                    " ",
                    "\n"
                ]
            },
            api = {
                delimiterCharacters: null,
                nonEdgeCharacters: null,
                reset: function() {
                    this.set(defaults);
                },
                set: function(config) {
                    var settings = _.extend({}, defaults, config);

                    if (settings['delimiter characters'] !== undefined) {
                        api.delimiterCharacters = settings['delimiter characters'];
                    }

                    if (settings['non-edge characters'] !== undefined) {
                        api.nonEdgeCharacters = settings['non-edge characters'];
                    }

                    return config;
                },
                isNonEdgeCharacter: function(char) {
                    return (api.nonEdgeCharacters.indexOf(char) >= 0);
                },
                isDelimiter: function(char) {
                    if (api.delimiterCharacters.indexOf('ANY') >= 0) {
                        return 1;
                    }
                    return (api.delimiterCharacters.indexOf(char) >= 0);
                }
            };

        return api;
    },
    Controller = function(editor, history, presenter, view) {
        return {
            init: function(confirmDiscardChangeMessage) {
                // Prevent the default selection by the browser with shift keies.
                editor.on('mousedown', function(e) {
                    if (e.shiftKey) {
                        return false;
                    }
                }).on('mousedown', '.textae-editor__type', function() {
                    // Prevent a selection of a type by the double-click.
                    return false;
                }).on('mousedown', '.textae-editor__body__text-box__paragraph-margin', function(e) {
                    // Prevent a selection of a margin of a paragraph by the double-click.
                    if (e.target.className === 'textae-editor__body__text-box__paragraph-margin') return false;
                });

                // Bind user input event to handler
                editor
                    .on('mouseup', '.textae-editor__body,.textae-editor__span,.textae-editor__grid,.textae-editor__entity', presenter.event.editorSelected)
                    .on('mouseenter', '.textae-editor__entity', function(e) {
                        view.hoverRelation.on($(this).attr('title'));
                    }).on('mouseleave', '.textae-editor__entity', function(e) {
                        view.hoverRelation.off($(this).attr('title'));
                    });

                history.bind('change', function(state) {
                    //change button state
                    view.viewModel.buttonStateHelper.enabled("write", state.hasAnythingToSave);
                    view.viewModel.buttonStateHelper.enabled("undo", state.hasAnythingToUndo);
                    view.viewModel.buttonStateHelper.enabled("redo", state.hasAnythingToRedo);

                    //change leaveMessage show
                    window.onbeforeunload = state.hasAnythingToSave ? function() {
                        return confirmDiscardChangeMessage;
                    } : null;
                });
            }
        };
    },
    getParams = function(editor) {
        // Read model parameters from url parameters and html attributes.
        var params = $.extend(require('./util/getUrlParameters')(location.search),
            // Html attributes preced url parameters.
            {
                config: editor.attr('config'),
                target: editor.attr('target')
            });

        // Mode is prior in the url parameter.
        if (!params.mode && editor.attr('mode')) {
            params.mode = editor.attr('mode');
        }

        // Read Html text and clear it.  
        var inlineAnnotation = editor.text();
        editor.empty();

        // Set annotaiton parameters.
        params.annotation = {
            inlineAnnotation: inlineAnnotation,
            url: params.target
        };

        return params;
    },
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
    };

module.exports = function() {
    // model manages data objects.
    var model = require('./model/Model')(this),
        // The history of command that providing undo and redo.
        history = require('./model/History')(),
        // Configulation of span
        spanConfig = new SpanConfig(),
        // Users can edit model only via commands. 
        command = require('./model/Command')(this, model, history, spanConfig),
        view = require('./view/View')(this, model),
        presenter = require('./presenter/Presenter')(this, model, view, command, spanConfig),
        //handle user input event.
        controller = new Controller(this, history, presenter, view),
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
                require('./util/ajaxAccessor')
                    .getAsync(config,
                        function(configFromServer) {
                            setSpanAndTypeConfig(configFromServer);
                            resetData(annotation);
                        },
                        function() {
                            alert('could not read the span configuration from the location you specified.');
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
        loadAnnotation = function(params, dataAccessObject) {
            var annotation = params.annotation;
            if (annotation) {
                if (annotation.inlineAnnotation) {
                    // Set an inline annotation.
                    setAnnotation(params.config, JSON.parse(annotation.inlineAnnotation));
                } else if (annotation.url) {
                    // Load an annotation from server.
                    dataAccessObject.getAnnotationFromServer(annotation.url);
                }
            }
        },
        loadOuterFiles = function(params, dataAccessObject) {
            presenter.setMode(params.mode);
            loadAnnotation(params, dataAccessObject);
        };

    // public funcitons of editor
    this.api = function(editor) {
        var initDao = function(confirmDiscardChangeMessage, setAnnotationFunc) {
                var dataAccessObject = require('./component/DataAccessObject')(editor, confirmDiscardChangeMessage);
                dataAccessObject.bind('save', history.saved);
                dataAccessObject.bind('load', function(annotation) {
                    setAnnotationFunc(annotation);
                });

                return dataAccessObject;
            },
            updateAPIs = function(dataAccessObject) {
                var showAccess = function() {
                        dataAccessObject.showAccess(history.hasAnythingToSave());
                    },
                    showSave = function() {
                        dataAccessObject.showSave(model.annotationData.toJson());
                    },
                    keyApiMap = {
                        'A': showAccess,
                        'C': presenter.event.copyEntities,
                        'D': presenter.event.removeSelectedElements,
                        'DEL': presenter.event.removeSelectedElements,
                        'E': presenter.event.createEntity,
                        'Q': presenter.event.showPallet,
                        'R': presenter.event.replicate,
                        'S': showSave,
                        'V': presenter.event.pasteEntities,
                        'W': presenter.event.newLabel,
                        'X': command.redo,
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
                        'textae.control.button.replicate_auto.click': view.viewModel.modeAccordingToButton['replicate-auto'].toggle,
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
                        presenter.event.redraw();
                    }
                };
            },
            start = function start(editor) {
                var CONFIRM_DISCARD_CHANGE_MESSAGE = 'There is a change that has not been saved. If you procceed now, you will lose it.';
                var params = getParams(editor);

                view.init();
                controller.init(CONFIRM_DISCARD_CHANGE_MESSAGE);
                presenter.init();

                var dataAccessObject = initDao(
                    CONFIRM_DISCARD_CHANGE_MESSAGE,
                    _.partial(setAnnotation, params.config)
                );

                loadOuterFiles(params, dataAccessObject);

                updateAPIs(dataAccessObject);
            };

        return {
            start: start
        };
    }(this);

    return this;
};