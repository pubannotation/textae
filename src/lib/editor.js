    var editor = function() {
        var idFactory = new IdFactory(this);

        // model manages data objects.
        var model = new Model(idFactory);

        // The history of command that providing undo and redo.
        var history = new History();

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

        // Users can edit model only via commands. 
        var command = new Command(idFactory, model, history, spanConfig);

        var view = new View(this, idFactory, model);

        var presenter = new Presenter(this, idFactory, model, view, command, spanConfig);

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
                        .on('mouseup', '.textae-editor__body,.textae-editor__span,.textae-editor__grid,.textae-editor__entity', presenter.editorSelected)
                        .on('mouseenter', '.textae-editor__entity', function(e) {
                            view.hoverRelation.on($(this).attr('title'));
                        }).on('mouseleave', '.textae-editor__entity', function(e) {
                            view.hoverRelation.off($(this).attr('title'));
                        });

                    // The jsPlumbConnetion has an original event mecanism.
                    // We can only bind the connection directory.
                    editor
                        .on('textae.editor.jsPlumbConnection.add', function(event, jsPlumbConnection) {
                            jsPlumbConnection.bind('click', presenter.jsPlumbConnectionClicked);
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

                    presenter.userEvent.viewHandler.init();
                }
            };
        }(this);

        // public funcitons of editor
        this.api = function(editor) {
            var getParams = function(editor) {
                    // Read model parameters from url parameters and html attributes.
                    var params = $.extend(textAeUtil.getUrlParameters(location.search),
                        // Html attributes preced url parameters.
                        {
                            config: editor.attr('config'),
                            target: editor.attr('target'),
                            mode: editor.attr('mode')
                        });

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
                setLineHeight = function(heightOfType) {
                    var TEXT_HEIGHT = 23,
                        MARGIN_TOP = 6,
                        MINIMUM_HEIGHT = 16 * 4;
                    var maxHeight = _.max(model.annotationData.span.all()
                        .map(function(span) {
                            var height = TEXT_HEIGHT + MARGIN_TOP;
                            var countHeight = function(span) {
                                // Grid height is height of types and margin bottom of the grid.
                                height += span.getTypes().length * heightOfType + view.viewModel.viewMode.marginBottomOfGrid;
                                if (span.parent) {
                                    countHeight(span.parent);
                                }
                            };

                            countHeight(span);

                            return height;
                        }).concat(MINIMUM_HEIGHT)
                    );
                    view.renderer.helper.changeLineHeight(maxHeight);
                },
                changeViewMode = function(prefix) {
                    // Change view mode accoding to the annotation data.
                    if (model.annotationData.relation.some() || model.annotationData.span.multiEntities().length > 0) {
                        presenter.userEvent.viewHandler.setViewMode(prefix + 'Instance');
                        setLineHeight(36);
                    } else {
                        presenter.userEvent.viewHandler.setViewMode(prefix + 'Term');
                        setLineHeight(18);
                    }
                },
                changeViewModeWithEdit = _.partial(changeViewMode, ''),
                changeViewModeWithoutEdit = _.compose(function() {
                    view.viewModel.buttonStateHelper.enabled('replicate-auto', false);
                    view.viewModel.buttonStateHelper.enabled('relation-edit-mode', false);
                }, _.partial(changeViewMode, 'View')),
                resetData = function(annotation) {
                    model.annotationData.reset(annotation);
                    history.reset();
                },
                setConfigByParams = function(params, dataAccessObject) {
                    var setConfig = function(params) {
                            var setTypeConfig = function(config) {
                                view.viewModel.typeContainer.setDefinedEntityTypes(config['entity types']);
                                view.viewModel.typeContainer.setDefinedRelationTypes(config['relation types']);

                                if (config.css !== undefined) {
                                    $('#css_area').html('<link rel="stylesheet" href="' + config.css + '"/>');
                                }
                            };

                            // Read default spanConfig
                            spanConfig.set();

                            if (params.config) {
                                // Load sync, because load annotation after load config. 
                                var configFromServer = textAeUtil.ajaxAccessor.getSync(params.config);
                                if (configFromServer !== null) {
                                    spanConfig.set(configFromServer);
                                    setTypeConfig(configFromServer);
                                } else {
                                    alert('could not read the span configuration from the location you specified.');
                                }
                            }
                        },
                        bindChangeViewMode = function(params) {
                            var changeViewMode = params.mode === 'edit' ?
                                changeViewModeWithEdit :
                                changeViewModeWithoutEdit;
                            model.annotationData.bind('all.change', changeViewMode);
                        },
                        loadAnnotation = function(params) {
                            var annotation = params.annotation;
                            if (annotation) {
                                if (annotation.inlineAnnotation) {
                                    // Set an inline annotation.
                                    resetData(JSON.parse(annotation.inlineAnnotation));
                                    _.defer(presenter.userEvent.viewHandler.redraw);
                                } else if (annotation.url) {
                                    // Load an annotation from server.
                                    dataAccessObject.getAnnotationFromServer(annotation.url);
                                }
                            }
                        };

                    setConfig(params);
                    bindChangeViewMode(params);
                    loadAnnotation(params);
                },
                initDao = function(confirmDiscardChangeMessage) {
                    var dataAccessObject = new DataAccessObject(editor, confirmDiscardChangeMessage);
                    dataAccessObject.bind('save', history.saved);
                    dataAccessObject.bind('load', resetData);

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
                            'C': presenter.userEvent.editHandler.copyEntities,
                            'D': presenter.userEvent.editHandler.removeSelectedElements,
                            'DEL': presenter.userEvent.editHandler.removeSelectedElements,
                            'E': presenter.userEvent.editHandler.createEntity,
                            'Q': presenter.userEvent.viewHandler.showPallet,
                            'R': presenter.userEvent.editHandler.replicate,
                            'S': showSave,
                            'V': presenter.userEvent.editHandler.pasteEntities,
                            'W': presenter.userEvent.editHandler.newLabel,
                            'X': command.redo,
                            'Y': command.redo,
                            'Z': command.undo,
                            'ESC': presenter.userEvent.viewHandler.cancelSelect,
                            'LEFT': presenter.userEvent.viewHandler.selectLeftSpan,
                            'RIGHT': presenter.userEvent.viewHandler.selectRightSpan,
                        },
                        iconApiMap = {
                            'textae.control.button.read.click': showAccess,
                            'textae.control.button.write.click': showSave,
                            'textae.control.button.undo.click': command.undo,
                            'textae.control.button.redo.click': command.redo,
                            'textae.control.button.replicate.click': presenter.userEvent.editHandler.replicate,
                            'textae.control.button.replicate_auto.click': view.viewModel.modeAccordingToButton['replicate-auto'].toggle,
                            'textae.control.button.relation_edit_mode.click': presenter.userEvent.viewHandler.toggleRelationEditMode,
                            'textae.control.button.entity.click': presenter.userEvent.editHandler.createEntity,
                            'textae.control.button.change_label.click': presenter.userEvent.editHandler.newLabel,
                            'textae.control.button.pallet.click': presenter.userEvent.viewHandler.showPallet,
                            'textae.control.button.delete.click': presenter.userEvent.editHandler.removeSelectedElements,
                            'textae.control.button.copy.click': presenter.userEvent.editHandler.copyEntities,
                            'textae.control.button.paste.click': presenter.userEvent.editHandler.pasteEntities,
                            'textae.control.button.setting.click': presenter.userEvent.viewHandler.showSettingDialog
                        };

                    // Update APIs
                    editor.api = {
                        handleKeyInput: _.partial(handle, keyApiMap),
                        handleButtonClick: _.partial(handle, iconApiMap),
                        redraw: presenter.userEvent.viewHandler.redraw
                    };
                },
                start = function start(editor) {
                    var CONFIRM_DISCARD_CHANGE_MESSAGE = 'There is a change that has not been saved. If you procceed now, you will lose it.';
                    var params = getParams(editor);

                    view.init();
                    controller.init(CONFIRM_DISCARD_CHANGE_MESSAGE);

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