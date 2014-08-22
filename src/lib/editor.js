module.exports = function() {
    // model manages data objects.
    var model = require('./model/Model')(this);

    // The history of command that providing undo and redo.
    var history = require('./model/History')();

    // Configulation of span
    var spanConfig = {
        delimiterCharacters: null,
        nonEdgeCharacters: null,
        defaults: {
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
        set: function(config) {
            var settings = $.extend({}, this.defaults, config);

            if (settings['delimiter characters'] !== undefined) {
                this.delimiterCharacters = settings['delimiter characters'];
            }

            if (settings['non-edge characters'] !== undefined) {
                this.nonEdgeCharacters = settings['non-edge characters'];
            }
        },
        isNonEdgeCharacter: function(char) {
            return (this.nonEdgeCharacters.indexOf(char) >= 0);
        },
        isDelimiter: function(char) {
            if (this.delimiterCharacters.indexOf('ANY') >= 0) {
                return 1;
            }
            return (this.delimiterCharacters.indexOf(char) >= 0);
        }
    };

    var // Users can edit model only via commands. 
        command = require('./model/Command')(this, model, history, spanConfig),
        view = require('./view/View')(this, model),
        presenter = require('./presenter/Presenter')(this, model, view, command, spanConfig);

    //handle user input event.
    var controller = function(editor) {
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
    }(this);

    // public funcitons of editor
    this.api = function(editor) {
        var getParams = function(editor) {
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
            resetData = function(annotation) {
                model.annotationData.reset(annotation);
                history.reset();
            },
            setConfigByParams = function() {
                var setTypeConfig = function(config) {
                        view.typeContainer.setDefinedEntityTypes(config['entity types']);
                        view.typeContainer.setDefinedRelationTypes(config['relation types']);

                        if (config.css !== undefined) {
                            $('#css_area').html('<link rel="stylesheet" href="' + config.css + '"/>');
                        }
                    },
                    setConfig = function(params) {
                        // Read default spanConfig
                        spanConfig.set();

                        if (params.config) {
                            // Load sync, because load annotation after load config. 
                            var configFromServer = require('./util/ajaxAccessor').getSync(params.config);
                            if (configFromServer !== null) {
                                spanConfig.set(configFromServer);
                                setTypeConfig(configFromServer);
                            } else {
                                alert('could not read the span configuration from the location you specified.');
                            }
                        }
                    },
                    loadAnnotation = function(params, dataAccessObject) {
                        var annotation = params.annotation;
                        if (annotation) {
                            if (annotation.inlineAnnotation) {
                                // Set an inline annotation.
                                resetData(JSON.parse(annotation.inlineAnnotation));
                                _.defer(presenter.event.redraw);
                            } else if (annotation.url) {
                                // Load an annotation from server.
                                dataAccessObject.getAnnotationFromServer(annotation.url);
                            }
                        }
                    };

                return function(params, dataAccessObject) {
                    setConfig(params);
                    presenter.setMode(params.mode);
                    loadAnnotation(params, dataAccessObject);
                };
            }(),
            initDao = function(confirmDiscardChangeMessage) {
                var dataAccessObject = require('./component/DataAccessObject')(editor, confirmDiscardChangeMessage);
                dataAccessObject.bind('save', history.saved);
                dataAccessObject.bind('load', function(data) {
                    resetData(data.annotation);
                });

                return dataAccessObject;
            },
            handle = function(map, key, value) {
                if (map[key]) map[key](value);
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

                var dataAccessObject = initDao(CONFIRM_DISCARD_CHANGE_MESSAGE);

                setConfigByParams(params, dataAccessObject);

                updateAPIs(dataAccessObject);
            };

        return {
            start: start
        };
    }(this);

    return this;
};