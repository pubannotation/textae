    // A sub component to save and load data.
    var makeDataAccessObject = function(editor) {
        var dataSourceUrl = "",
            loadedFunc,
            savedFunc,
            cursorChanger = function(editor) {
                var wait = function() {
                    this.addClass('textae-editor_wait');
                };
                var endWait = function() {
                    this.removeClass('textae-editor_wait');
                };
                return {
                    startWait: wait.bind(editor),
                    endWait: endWait.bind(editor),
                };
            }(editor),
            getMessageArea = function(editor) {
                return function() {
                    $messageArea = editor.find('.textae-editor__footer .textae-editor__footer__message');
                    if ($messageArea.length === 0) {
                        $messageArea = $("<div>").addClass("textae-editor__footer__message");
                        var $footer = $("<div>")
                            .addClass("textae-editor__footer")
                            .append($messageArea);
                        editor.append($footer);
                    }

                    return $messageArea;
                };
            }(editor),
            setDataSourceUrl = function(url) {
                if (url !== "") {
                    var targetDoc = url.replace(/\/annotations\.json$/, '');
                    getMessageArea().html("(Target: <a href='" + targetDoc + "'>" + targetDoc + "</a>)");
                    dataSourceUrl = url;
                }
            },
            getAnnotationFromServer = function(url) {
                cursorChanger.startWait();
                textAeUtil.ajaxAccessor.getAsync(url, function getAnnotationFromServerSuccess(annotation) {
                    loadedFunc(annotation);
                    setDataSourceUrl(url);
                }, function() {
                    cursorChanger.endWait();
                });
            },
            //load/saveDialog
            loadSaveDialog = function() {
                var extendOpenWithUrl = function($dialog) {
                        $dialog.open = _.compose($dialog.open.bind($dialog), function(url) {
                            if (url) {
                                this.find('[type="text"].url')
                                    .val(url)
                                    .trigger('keyup');
                            }
                        });

                        return $dialog;
                    },
                    getDialog = _.compose(extendOpenWithUrl, textAeUtil.getDialog);
                var getLoadDialog = function(editorId) {
                        var getAnnotationFromFile = function(file) {
                                var reader = new FileReader();
                                reader.onload = function() {
                                    var annotation = JSON.parse(this.result);
                                    loadedFunc(annotation);
                                };
                                reader.readAsText(file.files[0]);
                            },
                            makeOpenButton = function(className) {
                                return $('<input type="button" value="Open" disabled="disabled" />')
                                    .addClass(className);
                            };

                        var $inputServer = makeOpenButton('server');
                        var $inputLocal = makeOpenButton('local');

                        var $content = $('<div>')
                            .append(
                                $('<div class="textae-editor__load-dialog__row">').append(
                                    $('<label class="textae-editor__load-dialog__label">Server</label>'),
                                    $('<input type="text" class="textae-editor__load-dialog__file-name url" />'),
                                    $inputServer
                                )
                            )
                            .on('keyup', '[type="text"]', function() {
                                if (this.value) {
                                    $inputServer.removeAttr('disabled');
                                } else {
                                    $inputServer.attr('disabled', 'disabled');
                                }
                            })
                            .on('click', 'input.server',
                                function() {
                                    var url = $content.find('.textae-editor__load-dialog__file-name').val();
                                    getAnnotationFromServer(url);
                                    $content.dialogClose();
                                })
                            .append(
                                $('<div class="textae-editor__load-dialog__row">').append(
                                    $('<label class="textae-editor__load-dialog__label">Local</label>'),
                                    $('<input class="textae-editor__load-dialog__file" type="file" />'),
                                    $inputLocal
                                )
                            )
                            .on('change', '[type="file"]', function() {
                                if (this.files.length > 0) {
                                    $inputLocal.removeAttr('disabled');
                                } else {
                                    $inputLocal.attr('disabled', 'disabled');
                                }
                            })
                            .on('click', 'input.local',
                                function() {
                                    getAnnotationFromFile($content.find('[type="file"]')[0]);
                                    $content.dialogClose();
                                });

                        return getDialog(editorId, 'textae.dialog.load', 'Load Annotations', $content);
                    },
                    getSaveDialog = function(editorId) {
                        var showSaveSuccess = function() {
                                getMessageArea().html("annotation saved").fadeIn().fadeOut(5000, function() {
                                    $(this).html('').removeAttr('style');
                                    setDataSourceUrl(dataSourceUrl);
                                });
                                savedFunc();
                                cursorChanger.endWait();
                            },
                            showSaveError = function() {
                                getMessageArea().html("could not save").fadeIn().fadeOut(5000, function() {
                                    $(this).html('').removeAttr('style');
                                    setDataSourceUrl(dataSourceUrl);
                                });
                                cursorChanger.endWait();
                            },
                            saveAnnotationToServer = function(url, jsonData) {
                                cursorChanger.startWait();
                                textAeUtil.ajaxAccessor.post(url, {
                                    annotations: jsonData
                                }, showSaveSuccess, showSaveError, function() {
                                    cursorChanger.endWait();
                                });
                            },
                            createDownloadPath = function(contents) {
                                var blob = new Blob([contents], {
                                    type: 'application/json'
                                });
                                return URL.createObjectURL(blob);
                            },
                            getFilename = function() {
                                var $fileInput = getLoadDialog(editorId).find("input[type='file']"),
                                    file = $fileInput.prop('files')[0];

                                return file ? file.name : 'annotations.json';
                            };

                        var $content = $('<div>')
                            .append(
                                $('<div class="textae-editor__save-dialog__row">').append(
                                    $('<label class="textae-editor__save-dialog__label">Server</label>'),
                                    $('<input type="text" class="textae-editor__save-dialog__server-file-name url" />'),
                                    $('<input type="button" class="textae-editor__save-dialog__save-server-button" value="Save" />')
                                )
                            )
                            .on('click', '.textae-editor__save-dialog__save-server-button', function() {
                                var url = $content.find('.textae-editor__save-dialog__server-file-name').val();
                                saveAnnotationToServer(url, $dialog.jsonData);
                                $content.dialogClose();
                            })
                            .append(
                                $('<div class="textae-editor__save-dialog__row">').append(
                                    $('<label class="textae-editor__save-dialog__label">Local</label>'),
                                    $('<input type="text" class="textae-editor__save-dialog__local-file-name">'),
                                    $('<a class="download" href="#">Save</a>')
                                )
                            )
                            .on('click', 'a.download', function() {
                                var downloadPath = createDownloadPath($dialog.jsonData);
                                $(this)
                                    .attr('href', downloadPath)
                                    .attr('download', $content.find('.textae-editor__save-dialog__local-file-name').val());
                                savedFunc();
                                $content.dialogClose();
                            })
                            .append(
                                $('<div class="textae-editor__save-dialog__row">').append(
                                    $('<label class="textae-editor__save-dialog__label">Browser</label>'),
                                    $('<a class="viewsource" href="#">Click to view source on a new window.</a>')
                                )
                            )
                            .on('click', 'a.viewsource', function(e) {
                                var downloadPath = createDownloadPath($dialog.jsonData);
                                window.open(downloadPath, '_blank');
                                savedFunc();
                                $content.dialogClose();
                                return false;
                            });

                        var $dialog = getDialog(editorId, 'textae.dialog.save', 'Save Annotations', $content);

                        // Do not set twice.
                        if (!$dialog.openAndSetParam) {
                            // Set the filename and json when the dialog is opend.
                            $dialog.openAndSetParam = _.compose($dialog.open.bind($dialog), function(url, jsonData) {
                                // Set the filename.
                                var filename = getFilename();
                                $dialog
                                    .find('.textae-editor__save-dialog__local-file-name')
                                    .val(filename);

                                // Set the json.
                                $dialog.jsonData = jsonData;

                                return url;
                            });
                        }

                        return $dialog;
                    };

                return {
                    showLoad: function(editorId, url) {
                        getLoadDialog(editorId).open(url);
                    },
                    showSave: function(editorId, url, jsonData) {
                        getSaveDialog(editorId).openAndSetParam(url, jsonData);
                    }
                };
            }();

        return {
            getAnnotationFromServer: getAnnotationFromServer,
            showAccess: function() {
                loadSaveDialog.showLoad(editor.editorId, dataSourceUrl);
            },
            showSave: function(jsonData) {
                loadSaveDialog.showSave(editor.editorId, dataSourceUrl, jsonData);
            },
            setLoaded: function(loaded) {
                loadedFunc = loaded;
            },
            setSaved: function(saved) {
                savedFunc = saved;
            }
        };
    };